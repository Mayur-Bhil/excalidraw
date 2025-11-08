import { WebSocketServer, WebSocket } from 'ws'; // FIXED: Import WebSocket type from 'ws'
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Define User interface to track connected users
interface User {
  ws: WebSocket; // WebSocket connection instance
  rooms: string[]; // Array of room IDs the user has joined
  userId: string; // Unique user identifier
}


const users: User[] = [];

/**
 * Verify JWT token and extract userId
 * @param token - JWT token string
 * @returns userId if valid, null otherwise
 */
function checkUser(token: string): string | null {
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if decoded token is a string (should be an object)
    if (typeof decoded === "string") {
      return null;
    }

    // Check if userId exists in the decoded token
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    
    // Return the userId from the token
    return (decoded as JwtPayload).userId as string;
  } catch (error) {
    // Return null if token verification fails
    return null;
  }
}

// Handle new WebSocket connections
wss.on('connection', function connection(ws, request) {
  const url = request.url;
  
  // Check if URL exists
  if (!url) {
    ws.close();
    return;
  }

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  
  // Verify token and get userId
  const userId = checkUser(token);

  // Close connection if token is invalid
  if (userId == null) {
    ws.close();
    return;
  }

  // Add new user to the users array
  // FIXED: Use 'ws' (the instance) instead of 'WebSocket' (the type)
  users.push({
    userId,
    rooms: [],
    ws // This is the actual WebSocket connection instance
  });

  // Handle incoming messages from this client
  ws.on("message", function message(data) {
    try {
      // Parse incoming JSON data
      const parsedData = JSON.parse(data as unknown as string);

      // Handle joining a room
      if (parsedData.type === "join_room") {
        const user = users.find(x => x.ws === ws);
        if (user && parsedData.roomId) {
          user.rooms.push(parsedData.roomId);
          console.log(`User ${userId} joined room ${parsedData.roomId}`);
        }
      }

      // Handle leaving a room
      // FIXED: Used correct property name 'roomId' and actually remove the room
      if (parsedData.type === "leave_room") {
        const user = users.find(x => x.ws === ws);
        if (user && parsedData.roomId) {
          user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
          console.log(`User ${userId} left room ${parsedData.roomId}`);
        }
      }

      // Broadcast message to all users in the same room
      // FIXED: Get roomId from parsedData
      if (parsedData.type === "chat" && parsedData.roomId && parsedData.message) {
        const roomId = parsedData.roomId; // FIXED: Define roomId variable
        const message = parsedData.message;

        // Send message to all users in the same room
        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId: roomId,
              senderId: userId // Include who sent the message
            }));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  // Handle client disconnection
  // FIXED: Remove user from array when they disconnect
  ws.on("close", function close() {
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
      console.log(`User ${userId} disconnected`);
      users.splice(index, 1);
    }
  });

  // Handle WebSocket errors
  ws.on("error", function error(err) {
    console.error(`WebSocket error for user ${userId}:`, err);
  });
});

console.log("WebSocket server running on port 8080");