import { UnauthenticatedError } from "../errors/customErrors";
import { verifyJWT } from "../utils/token";
import { Request, Response, NextFunction } from "express";

interface UserPayload {
  userId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    // Clear old token first
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const payload = verifyJWT(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
