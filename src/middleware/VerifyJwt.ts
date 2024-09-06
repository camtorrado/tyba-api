// src/middleware/VerifyJwt.ts
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../services/jwtService";
import { PrismaRevokedTokenRepository } from "../repositories/implementations/PrismaRevokedTokenRepository";

const revokedTokenRepository = new PrismaRevokedTokenRepository();

/**
 * Middleware to verify the JWT in the Authorization header and check if it's revoked.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const verifyJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if the token is revoked
    const isRevoked = await revokedTokenRepository.isTokenRevoked(token);
    if (isRevoked) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    // Verify and decode the JWT
    const payload = verifyJwt(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach the decoded payload to the request object
    req.body.jwtPayload = payload;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyJwtMiddleware;
