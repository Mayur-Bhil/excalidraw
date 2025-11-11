import { WebSocketServer, WebSocket } from 'ws'; 
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET,WS_PORT } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client"

// Create WebSocket server on port 2025

const wss = new WebSocketServer({ port: WS_PORT as number}) ;

// Define User interface to track connected users
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    
    return (decoded as JwtPayload).userId as string;
  } catch (error) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  // console.log("ws",ws );
  // console.log("request",request );
  const url = request.url;
  
  if (!url) {
    ws.close();
    return;
  }

  // FIXED: Better URL parsing
  const queryString = url.includes('?') ? url.split('?')[1] : '';
  // console.log("queryString :",queryString);
  const queryParams = new URLSearchParams(queryString);
  // console.log("queryParams : ",queryParams );
  const token = queryParams.get("token") || "";
  // console.log("token :", token);
  
  const userId = checkUser(token);
  // console.log("userId : ", userId);

  if (userId == null) {
    ws.close();
    return;
  }

  console.log(`User ${userId} connected`);

  // Add user to tracking array
  users.push({
    userId,
    rooms: [],
    ws
  });

  // Handle incoming messages
  ws.on("message",async function message(data) {
    try {
      const parsedData = JSON.parse(data.toString()); // FIXED: Proper parsing
      
      // Handle joining rooms
      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        if (user && !user.rooms.includes(parsedData.roomId)) {
          user.rooms.push(parsedData.roomId);
          console.log(`User ${userId} joined room ${parsedData.roomId}`);
        }
      }

      // Handle leaving rooms - FIXED
      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
          console.log(`User ${userId} left room ${parsedData.roomId}`);
        }
      }

      // Handle chat messages
      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prismaClient.chat.create({
            data:{
              roomId,
              message,
              userId
            }
        });
        
        users.forEach(user => {
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId,
              userId // Include who sent the message
            }));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(JSON.stringify({
        type: "error",
        message: "Invalid message format"
      }));
    }
  });

  // Handle disconnection
  ws.on("close", function close() {
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
      console.log(`User ${userId} disconnected`);
      users.splice(index, 1);
    }
  });

  // Handle errors
  ws.on("error", function error(err) {
    console.error(`WebSocket error for user ${userId}:`, err);
  });
});

console.log(`WebSocket server running on port ${WS_PORT}`);