import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>(); // FIXED: Typo "soket" -> "socket"

  useEffect(() => {
    // FIXED: Added token from localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`); // FIXED: Added token to URL
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setLoading(false);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    // FIXED: Added cleanup function to prevent memory leak
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return {
    socket, // FIXED: Typo "soket" -> "socket"
    loading
  };
}