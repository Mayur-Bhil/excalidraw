"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useSocket"; // FIXED: Changed "useHook" -> "useSocket"

interface Message {
  id?: number;
  message: string;
  userId?: string;
  userName?: string;
  roomId?: number;
}

export function ChatRoomClient({
  messages,
  id
}: {
  messages: Message[];
  id: number; // FIXED: Changed to number
}) {
  const { socket, loading } = useSocket(); // FIXED: Typo "soket" -> "socket"
  const [chats, setChats] = useState<Message[]>(messages);
  const [currentMessage, setCurrentMessage] = useState(""); // FIXED: Typo "currentmessage" -> "currentMessage"

  useEffect(() => {
    if (socket && !loading) {
      socket.send(JSON.stringify({
        type: "join_room",
        roomId: id
      }));

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        
        if (parsedData.type === "chat") {
          // FIXED: Changed from parsedData.message to entire parsedData object
          setChats(c => [...c, {
            message: parsedData.message,
            userId: parsedData.userId,
            userName: parsedData.userName
          }]);
        }
      };
    }
  }, [socket, loading, id]);

  const sendMessage = () => {
    if (!currentMessage.trim() || !socket) return; // FIXED: Added validation

    socket.send(JSON.stringify({
      type: "chat",
      roomId: id,
      message: currentMessage
    }));
    
    setCurrentMessage(""); // FIXED: Clear input after sending
  };

  if (loading) {
    return <div>Connecting...</div>; // FIXED: Added loading state
  }

  if (!socket) {
    return <div>Failed to connect. Please login first.</div>; // FIXED: Added error state
  }

  return (
    <div>
      <div>
        {chats.map((m, index) => (
          <div key={index}>
            {m.userName && <strong>{m.userName}: </strong>}
            {m.message}
          </div>
        ))}
      </div>

      <input 
        type="text" 
        value={currentMessage} 
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') sendMessage(); // FIXED: Added Enter key support
        }}
      />
      
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

// ============= app/page.tsx (Home) =============
