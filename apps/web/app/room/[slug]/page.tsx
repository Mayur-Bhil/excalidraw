import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../conponents/chatRoom";


 async function getRoomId(slug:string) {
    const responce = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return responce.data.id;
}


export default async function ChatRoom11({
    params
}:{
    params:{
        slug:string
    }
}){
    const parsedparams = (await params)
     const slug = parsedparams.slug;
    const roomId = await getRoomId(slug);


    return <ChatRoom id={roomId}></ChatRoom>
}