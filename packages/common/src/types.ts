import { z } from "zod"

export const createUserSchama = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(6),
    name:z.string()
})


export const signInSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(6)
})

export const CreateRoomSchama = z.object({
    name:z.string().min(4).max(6)
})