import { email, z } from "zod"

export const createUserSchema = z.object({
    name:z.string().min(2,"name should Be at least 2 characters"),
    email: z.string().includes("@"),
    password:z.string().min(6,"Password Must Be at least 6 characters"),
})


export const signInSchema = z.object({
    email:z.string().includes("@"),
    password:z.string().min(6,"Password Must Be at least 6 characters"),
})

export const CreateRoomSchama = z.object({
    name:z.string().min(4).max(6)
})