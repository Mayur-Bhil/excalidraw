"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      background: "black",
      color: "white"
    }}>
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px"
      }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <h1 style={{ marginBottom: "30px" }}>Join a Chat Room</h1>

      <div style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room Name"
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#2a2a2a",
            color: "white",
            minWidth: "250px"
          }}
        />

        <button 
          onClick={() => {
            if (roomId.trim()) {
              router.push(`/room/${roomId}`);
            }
          }}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}