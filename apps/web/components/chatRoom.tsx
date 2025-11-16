"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";
import { useRouter } from "next/navigation";

export function ChatRoom({ slug }: { slug: string }) {
  const [roomData, setRoomData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/signin");
          return;
        }

        // Get room info
        const roomResponse = await axios.get(`${BACKEND_URL}/room/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const room = roomResponse.data.data;
        setRoomData(room);

        // Get messages
        const messagesResponse = await axios.get(`${BACKEND_URL}/chats/${room.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMessages(messagesResponse.data.data.messages);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching room:", err);
        setError(err.response?.data?.message || "Failed to load room");
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [slug, router]);

  if (loading) {
    return <div style={{ color: "white", padding: "20px" }}>Loading room...</div>;
  }

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>{error}</div>;
  }

  if (!roomData) {
    return <div style={{ color: "white", padding: "20px" }}>Room not found</div>;
  }

  return <ChatRoomClient id={roomData.id} messages={messages} />;
}