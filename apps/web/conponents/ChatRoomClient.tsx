"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useHook";


export function ChatRoomClient({
    messages,
    id
}:{
    messages:{message:string}[];
    id:string
}){
    const {soket,loading} = useSocket();
    const [chats,setChats] = useState(messages);
    const [currentmessage,setcurrentmessage]  = useState("");


    useEffect(()=>{
        if(soket && !loading){

            soket.send(JSON.stringify({
                type:"join_room",
                roomId:id
            }))


            soket.onmessage = (event) =>{
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                        
                    setChats(c => [...c,parsedData.message])
                }
            }
        }   
    },[soket,loading,id]) ;
    
    return <div>
            {messages.map((m,index)=><div key={index}>{m.message}</div>)}

            <input type="text" value={currentmessage} onChange={(e)=>{
                    setcurrentmessage(e.target.value)
            }}/>
            
            <button onClick={()=>{
                soket?.send(JSON.stringify({
                    type:"chat",
                    roomId:id,
                    message:currentmessage
                }))
            }}>send Message</button>
    </div>
}   