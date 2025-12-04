

import { RoomCanvas } from "@/app/components/roomCanvas";

export default async function Canvas({params}:{
    params:{
        roomId:string
    }
}){
    const roomId = (await params).roomId;
    return <RoomCanvas roomId={roomId}/>
    
}
