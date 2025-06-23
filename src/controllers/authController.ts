import { NextFunction, Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/passwordUtil";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors";
import { createJWT, verifyJWT } from "../utils/token";
import { sendVerificationEmail } from "../utils/emailServices";

export interface RegisterRequest extends Request {
  // Add body/query params as needed, e.g.:
  // body: {
  //     username: string;
  //     password: string;
  // }
}

export interface RegisterResponse extends Response {}

export const register = async (
  req: RegisterRequest,
  res: RegisterResponse,
  next: NextFunction
): Promise<void> => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    req.body.role = req.body.role || "tenant"; // Default to tenant if not provided

    const newUser = await User.create({ ...req.body });

    // Generate email verification token
    const token = createJWT({ userId: newUser._id?.toString() });

    // Send email
    const emailRes = await sendVerificationEmail(newUser.email, token);

    if (!emailRes.data)
      throw new BadRequestError("Failed to send verification token!");

    res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("Registration Error", error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new UnauthenticatedError("Email does not exist");
    }

    if (!user.isVerified) {
      throw new UnauthorizedError(
        "Email is not yet verified, Please check your email to verify!"
      );
    }

    const isPasswordValid = await comparePassword(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) throw new UnauthenticatedError("Invalid password");

    const token = createJWT({ userId: user._id, role: user.role });

    const oneday = 1000 * 60 * 60 * 24; // 1 day in milliseconds

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      // maxAge: oneday, // Set cookie expiration to 1 day
      expires: new Date(Date.now() + oneday), // Set cookie expiration date
      sameSite: "strict",
    });

    res.status(StatusCodes.OK).json({ msg: "Login successful", success: true });
  } catch (error) {
    console.error(error);
    next(error); // Pass error to the error-handling middleware
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!", success: true });
};

//verify email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { verificationToken } = req.query;

  if (!verificationToken || typeof verificationToken !== "string") {
    return next(new UnauthenticatedError("Invalid verification token!"));
  }

  try {
    const decoded = verifyJWT(verificationToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(
        new UnauthenticatedError("No user found for this verification token.")
      );
    }

    if (user.isVerified) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        isVerified: true,
        msg: "Email is already verified.",
      });
      return;
    }

    res.cookie("verificationToken", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    user.isVerified = true as any;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Verification Success",
    });
  } catch (error: any) {
    console.error("Verification failed:", error.message || error);
    next(new UnauthenticatedError("Failed to verify email!"));
  }
};
