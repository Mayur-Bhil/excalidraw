import { z } from "zod"

export const createUserSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(6,"Password Must Be at least 6 characters"),
    name:z.string().min(2,"name should Be at least 2 characters"),
    email: z.string().email("Invalid email"),
})


export const signInSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(6)
})

export const CreateRoomSchama = z.object({
    name:z.string().min(4).max(6)
})