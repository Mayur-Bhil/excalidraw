    import  express from "express";
    import jwt from "jsonwebtoken"
    import {JWT_SECRET} from "@repo/backend-common/config"
    import { middlware } from "./middlware";
    import {CreateRoomSchama, createUserSchema} from "@repo/common/types"
    import { prismaClient } from "@repo/db/client";
    import bcrypt from "bcrypt"

    const app = express();
    const port  = 3001;
    app.use(express.json())

app.post("/signup", async (req, res) => {
  try {
    // 1. Validate input
    const parsedData = createUserSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: parsedData.error
      });
    }

    const { name, email, password } = parsedData.data;

    // 2. Check if user already exists (by email or username)
    const existingUser = await prismaClient.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? "User with this email already exists" 
          : "Username is already taken",
      });
    }

    // 3. Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        // createdAt: true,
       
      },
    });

    // 5. Send success response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
    app.post("/signin",(req,res)=>{
        const userId = 1;

        const  token = jwt.sign({   
            userId
        },JWT_SECRET)

        res.json({

        })
    })

    app.post("/room",middlware,(req,res)=>{
        const data = CreateRoomSchama.safeParse(req.body);

        if(!data.success){
            res.json({
                message :"Incorrect inputs"
            })
            return ;
        }
        res.json({
            roomId:132
        })
    })

    app.listen(port,()=>{
        console.log(`server is listening on Port ${port}`);
    
    })