import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middlware";
import { CreateRoomSchema, createUserSchema, signInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";

const app = express();
const port = 3001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later"
});

app.use(generalLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    message: "Server is up and running 😄",
    timestamp: new Date().toISOString()
  });
});

// Signup endpoint
app.post("/signup", authLimiter, async (req, res) => {
  try {
    // Validate input
    const parsedData = createUserSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: parsedData.error.message
      });
    }

    const { name, email, password } = parsedData.data;

    // Check if user exists (don't reveal which field conflicts)
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
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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
        createAt: true,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { 
        user,
        token 
      },
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Signin endpoint
app.post("/signin", authLimiter, async (req, res) => {
  try {
    // Validate input
    const parsedData = signInSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: parsedData.error.message
      });
    }

    const { email, password } = parsedData.data;

    // Find user
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      }); 
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create room endpoint
app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      errors: parsedData.error.message
    });
  }

  const userId = req.userId as string;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
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
      message: "Room created successfully",
      data: {
        roomId: room.id,
        slug: room.slug
      }
    });
  } catch (error: any) {
    console.error("Room creation error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Room with this name already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create room"
    });
  }
});

// Get chat messages (with authorization)
app.get("/chats/:roomId", middleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const userId = req.userId;
    
    if (isNaN(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID"
      });
    }

    // Check if room exists
    const room = await prismaClient.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    // Get pagination parameters
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const before = req.query.before ? Number(req.query.before) : undefined;

    // Fetch messages
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId,
        ...(before && { id: { lt: before } })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        id: "desc"
      },
      take: limit
    });

    // FIXED: Calculate oldest ID before reversing
    const oldestMessageId = messages.length > 0 ? messages[messages.length - 1]?.id ?? null : null;

    return res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        hasMore: messages.length === limit,
        oldestMessageId
      }
    });

  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages"
    });
  }
});

// Get room by slug
app.get("/room/:slug", middleware, async (req, res) => {
  try {
    const slug = req.params.slug;
    
    const room = await prismaClient.room.findFirst({
      where: { slug },
      select: {
        id: true,
        slug: true,
        adminId: true,
        createAt: true
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    return res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch room"
    });
  }
});

// Get user's rooms
app.get("/rooms", middleware, async (req, res) => {
  try {
    const userId = req.userId;

    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId
      },
      select: {
        id: true,
        slug: true,
        createAt: true,
        _count: {
          select: {
            chats: true
          }
        }
      },
      orderBy: {
        createAt: "desc"
      }
    });

    return res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms"
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});