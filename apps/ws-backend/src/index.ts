import { WebSocketServer, WebSocket } from 'ws'; 
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, WS_PORT } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

// Message types for type safety
interface JoinRoomMessage {
  type: "join_room";
  roomId: number;
}

interface LeaveRoomMessage {
  type: "leave_room";
  roomId: number;
}

interface ChatMessage {
  type: "chat";
  roomId: number;
  message: string;
}

type IncomingMessage = JoinRoomMessage | LeaveRoomMessage | ChatMessage;

// User interface
interface User {
  ws: WebSocket;
  rooms: Set<number>; // Use Set for better performance
  userId: string;
  lastActivity: Date;
}

const users = new Map<WebSocket, User>(); // Use Map for O(1) lookups

// Verify JWT token
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (typeof decoded === "string" || !decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    
    return (decoded as JwtPayload).userId as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Validate incoming message structure
function isValidMessage(data: any): data is IncomingMessage {
  if (!data || typeof data !== "object" || !data.type) return false;
  
  if (data.type === "join_room" || data.type === "leave_room") {
    return typeof data.roomId === "number";
  }
  
  if (data.type === "chat") {
    return (
      typeof data.roomId === "number" &&
      typeof data.message === "string" &&
      data.message.trim().length > 0 &&
      data.message.length <= 5000 // Max message length
    );
  }
  
  return false;
}

// Check if user has access to room
async function canAccessRoom(userId: string, roomId: number): Promise<boolean> {
  try {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      select: { adminId: true }
    });
    
    // For now, allow all authenticated users
    // You can add more complex logic here (e.g., room members, invites)
    return room !== null;
  } catch (error) {
    console.error("Error checking room access:", error);
    return false;
  }
}

// Broadcast message to room participants
function broadcastToRoom(roomId: number, message: object, excludeWs?: WebSocket) {
  let sentCount = 0;
  
  users.forEach((user, ws) => {
    if (user.rooms.has(roomId) && ws !== excludeWs) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        sentCount++;
      }
    }
  });
  
  console.log(`Broadcasted to ${sentCount} users in room ${roomId}`);
}

// Clean up inactive connections (run periodically)
function cleanupInactiveUsers() {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  users.forEach((user, ws) => {
    if (now.getTime() - user.lastActivity.getTime() > timeout) {
      console.log(`Cleaning up inactive user ${user.userId}`);
      ws.close();
      users.delete(ws);
    }
  });
}

// Run cleanup every 5 minutes
setInterval(cleanupInactiveUsers, 5 * 60 * 1000);

// WebSocket server
const wss = new WebSocketServer({ port: WS_PORT as number });

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  
  if (!url) {
    ws.close(1008, "URL required");
    return;
  }

  // Parse query parameters
  const queryString = url.includes('?') ? url.split('?')[1] : '';
  const queryParams = new URLSearchParams(queryString);
  const token = queryParams.get("token") || "";
  
  const userId = checkUser(token);

  if (userId === null) {
    ws.close(1008, "Invalid token");
    return;
  }

  console.log(`User ${userId} connected`);

  // Add user to tracking
  users.set(ws, {
    userId,
    rooms: new Set<number>(),
    ws,
    lastActivity: new Date()
  });

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: "connected",
    userId: userId,
    message: "Connected successfully"
  }));

  // Handle incoming messages
  ws.on("message", async function message(data) {
    const user = users.get(ws);
    if (!user) return;

    // Update activity timestamp
    user.lastActivity = new Date();

    try {
      const parsedData = JSON.parse(data.toString());
      
      // Validate message format
      if (!isValidMessage(parsedData)) {
        ws.send(JSON.stringify({
          type: "error",
          message: "Invalid message format"
        }));
        return;
      }

      // Handle joining rooms
      if (parsedData.type === "join_room") {
        const { roomId } = parsedData;
        
        // Check if user can access this room
        const hasAccess = await canAccessRoom(userId, roomId);
        
        if (!hasAccess) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Room not found or access denied",
            roomId
          }));
          return;
        }

        if (!user.rooms.has(roomId)) {
          user.rooms.add(roomId);
          console.log(`User ${userId} joined room ${roomId}`);
          
          // Notify user
          ws.send(JSON.stringify({
            type: "joined_room",
            roomId,
            message: "Successfully joined room"
          }));

          // Notify others in room
          broadcastToRoom(roomId, {
            type: "user_joined",
            roomId,
            userId
          }, ws);
        }
      }

      // Handle leaving rooms
      if (parsedData.type === "leave_room") {
        const { roomId } = parsedData;
        
        if (user.rooms.has(roomId)) {
          user.rooms.delete(roomId);
          console.log(`User ${userId} left room ${roomId}`);
          
          ws.send(JSON.stringify({
            type: "left_room",
            roomId,
            message: "Successfully left room"
          }));

          // Notify others
          broadcastToRoom(roomId, {
            type: "user_left",
            roomId,
            userId
          }, ws);
        }
      }

      // Handle chat messages
      if (parsedData.type === "chat") {
        const { roomId, message } = parsedData;
        
        // Check if user is in the room
        if (!user.rooms.has(roomId)) {
          ws.send(JSON.stringify({
            type: "error",
            message: "You must join the room before sending messages",
            roomId
          }));
          return;
        }

        // Save to database
        const savedMessage = await prismaClient.chat.create({
          data: {
            roomId,
            message: message.trim(),
            userId
          },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        // Broadcast to all room participants (including sender)
        const broadcastMessage = {
          type: "chat",
          messageId: savedMessage.id,
          message: savedMessage.message,
          roomId,
          userId,
          userName: savedMessage.user.name,
          timestamp: savedMessage.createAt
        };

        // Send to all users in room
        users.forEach((u, userWs) => {
          if (u.rooms.has(roomId) && userWs.readyState === WebSocket.OPEN) {
            userWs.send(JSON.stringify(broadcastMessage));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({
        type: "error",
        message: "Failed to process message"
      }));
    }
  });

  // Handle disconnection
  ws.on("close", function close() {
    const user = users.get(ws);
    if (user) {
      console.log(`User ${userId} disconnected`);
      
      // Notify all rooms this user was in
      user.rooms.forEach(roomId => {
        broadcastToRoom(roomId, {
          type: "user_left",
          roomId,
          userId
        });
      });
      
      users.delete(ws);
    }
  });

  // Handle errors
  ws.on("error", function error(err) {
    console.error(`WebSocket error for user ${userId}:`, err);
    users.delete(ws);
  });
});

console.log(`WebSocket server running on port ${WS_PORT}`);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing WebSocket server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});