import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 2. Extract token (supports "Bearer <token>" format)
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // 4. Attach userId to request object
    req.userId = decoded.userId;

    // 5. Continue to next middleware/route
    next();

  } catch (error: any) {
    console.error("Auth middleware error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}