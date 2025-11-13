"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  
  return (
    <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"100vh",
        width:"100vw",
        background:"Black"

    }}>
      <input 
      style={{
        padding:"4px"
      }}
        type="text" 
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room Id"
      />

      <button 
      style={{
        padding:"2px",
        color:"green",
        background:"white",
        font:"bold"
      }}
      onClick={() => {
        router.push(`/room/${roomId}`)
      }}
      
      >
        Join_Room
      </button>
    </div>
  );
}