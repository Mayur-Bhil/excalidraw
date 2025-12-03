"use client"

import initDraw from "@/app/draw";
import { useEffect, useRef } from "react"

export default function Canvas(){

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{

        if(canvasRef.current){
               const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            
            if(!ctx){
                return;
            }
            initDraw(canvasRef.current)
        }

    },[canvasRef]);

    return  <div className="cursor-crosshair h-full w-full">
                <canvas height={799} width={2000} ref={canvasRef}>
                </canvas>
        </div>
}
