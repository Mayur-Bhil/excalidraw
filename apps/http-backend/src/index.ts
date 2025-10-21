    import  express from "express";
    import jwt from "jsonwebtoken"
    import {JWT_SECRET} from "@repo/backend-common/config"
    import { middleware } from "./middlware";
    import {CreateRoomSchama, createUserSchema, signInSchema} from "@repo/common/types"
    import { prismaClient } from "@repo/db/client";
    import bcrypt from "bcrypt"

    const app = express();
    const port  = 3001;
    app.use(express.json())

app.get("/helth",(req,res)=>{
    res.json({
        Message : "Server is Up and Running 😄"
    })
})

app.post("/signup", async (req, res) => {
  try {
    // 1. Validate input
    const parsedData = createUserSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: parsedData.error.message
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

app.post("/signin", async (req, res) => {
  try {
    // 1. Validate input
    const parsedData = signInSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: parsedData.error.message
      });
    }

    const { email, password } = parsedData.data;

    // 2. Find user by email
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      }); 
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // 5. Send success response
    return res.status(200).json({
      success: true,
      message: "Signin successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });

  } catch (error: any) {
    console.error("Signin error:", error);

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/room", middleware, async(req, res) => {
  const parsedData = CreateRoomSchama.safeParse(req.body);

  if(!parsedData.success){
    return res.status(400).json({
      message: "Incorrect inputs",
      errors: parsedData.error.message  
    });
  }

  const userId = req.userId as string; // Assert it's a string
  
  // Or add a check:
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized - User ID missing"
    });
  }
  
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId
      }
    });
    
    return res.status(201).json({
      success: true,
      roomId: room.id
    });
  } catch (error: any) {
    console.error("Room creation error:", error);

    return res.status(411).json({
      success: false,
      message: "Room with this name already exists"
    });
  }
});

    app.listen(port,()=>{
        console.log(`server is listening on http://localhost:${port} `);
    
    })