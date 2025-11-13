import axios from "axios"
import { BACKEND_URL } from "../app/config"


async function getchats(roomId:string){
    const responce = await axios.get(`${BACKEND_URL}/cahts/${roomId}`)
    return responce.data.messages
}
export async function ChatRoom({id}:{
    id:string
}){
    const messages = await getchats(id);
}   