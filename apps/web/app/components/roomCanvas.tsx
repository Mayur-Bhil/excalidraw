"use client"

import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";
import Canvas from "../canvas/[roomId]/page";

export function RoomCanvas({roomId}:{
    roomId:string
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [soket,setSocket] = useState<WebSocket | null>(null);

        useEffect(()=>{
            const ws = new WebSocket(WS_URL);

            ws.onopen = () =>{
                setSocket(ws)
            }
        },[])

        if(!soket){
            return <div>Connecting to the Server</div>
        }
        return  <div className="cursor-crosshair h-full w-full">
                    <Canvas roomId={roomId}/>
                    
            </div>
    }
    