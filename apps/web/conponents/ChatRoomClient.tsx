"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useHook";


export function chatRoomClient({
    messages,
    id
}:{
    messages:{message:string}[];
    id:string
}){
    const {soket,loading} = useSocket();
    const [chats,setChats] = useState(messages);


    useEffect(()=>{
        if(soket && !loading){
            soket.onmessage = (event) =>{
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                        
                    setChats(c => [...c,parsedData.message])
                }
            }
        }   
    },[soket,loading])  
}