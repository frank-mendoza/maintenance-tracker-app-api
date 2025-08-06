"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUserSetup = exports.sendVerificationToken = exports.verifyUserSetup = exports.verifyEmail = exports.logout = exports.login = exports.register = void 0;
const passwordUtil_1 = require("../utils/passwordUtil");
const User_1 = __importDefault(require("../models/User"));
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const token_1 = require("../utils/token");
const emailServices_1 = require("../utils/emailServices");
const register = async (req, res, next) => {
    try {
        const hashedPassword = await (0, passwordUtil_1.hashPassword)(req.body.password);
        req.body.password = hashedPassword;
        req.body.role = req.body.role || "tenant"; // Default to tenant if not provided
        const newUser = await User_1.default.create({ ...req.body });
        // Generate email verification token
        const token = (0, token_1.createJWT)({ userId: newUser._id?.toString() });
        // Send email
        const emailRes = await (0, emailServices_1.sendVerificationEmail)(newUser.email, token);
        if (!emailRes.data)
            throw new customErrors_1.BadRequestError("Failed to send verification token!");
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: "User registered successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Registration Error", error);
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const user = await User_1.default.findOne({ email: req.body.email }).select("+password");
        if (!user) {
            throw new customErrors_1.UnauthenticatedError("Email does not exist");
        }
        if (user.manuallyCreated) {
            throw new customErrors_1.UnauthorizedError("User account is not set up yet. Please check your email for the setup link.");
        }
        if (!user.isVerified) {
            throw new customErrors_1.UnauthorizedError("Email is not yet verified, Please check your email to verify!");
        }
        const isPasswordValid = await (0, passwordUtil_1.comparePassword)(req.body.password, user?.password);
        if (!isPasswordValid)
            throw new customErrors_1.UnauthenticatedError("Invalid password");
        const token = (0, token_1.createJWT)({ userId: user._id, role: user.role });
        const oneday = 1000 * 60 * 60 * 24; // 1 day in milliseconds
        // Clear old token first
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            // maxAge: oneday, // Set cookie expiration to 1 day
            expires: new Date(Date.now() + oneday), // Set cookie expiration date
            sameSite: "strict",
        });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ msg: "Login successful", success: true, user });
    }
    catch (error) {
        console.error(error);
        next(error); // Pass error to the error-handling middleware
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user logged out!", success: true });
};
exports.logout = logout;
//verify email
const verifyEmail = async (req, res, next) => {
    const { verificationToken } = req.query;
    if (!verificationToken || typeof verificationToken !== "string") {
        return next(new customErrors_1.UnauthenticatedError("Invalid verification token!"));
    }
    try {
        const decoded = (0, token_1.verifyJWT)(verificationToken);
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return next(new customErrors_1.UnauthenticatedError("No user found for this verification token."));
        }
        if (user.isVerified) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
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
        user.isVerified = true;
        await user.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            msg: "Verification Success",
        });
    }
    catch (error) {
        console.error("Verification failed:", error.message || error);
        next(new customErrors_1.UnauthenticatedError("Failed to verify email!"));
    }
};
exports.verifyEmail = verifyEmail;
//verify user setup token
const verifyUserSetup = async (req, res, next) => {
    const { setup_account_token } = req.query;
    if (!setup_account_token || typeof setup_account_token !== "string") {
        return next(new customErrors_1.UnauthenticatedError("Invalid user setup token!"));
    }
    try {
        const decoded = (0, token_1.verifyJWT)(setup_account_token);
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return next(new customErrors_1.UnauthenticatedError("No user found for this setup token."));
        }
        if (!user.manuallyCreated) {
            res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                success: true,
                isVerified: true,
                user,
                msg: "Account is already set up. Please login.",
            });
            return;
        }
        res.cookie("setup_account_token", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        user.manuallyCreated = false; // Mark as set up
        user.save(); // Save the user with the manuallyCreated flag
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            user,
            msg: "Setup token verified successfully",
        });
    }
    catch (error) {
        console.error("Verification failed:", error.message || error);
        next(new customErrors_1.UnauthenticatedError(error?.message || "Failed to verify setup token!"));
    }
};
exports.verifyUserSetup = verifyUserSetup;
const sendVerificationToken = async (req, res) => {
    const { userId, userEmail } = req.body;
    try {
        const token = (0, token_1.createJWT)({ userId });
        // Send email
        const emailRes = await (0, emailServices_1.sendVerificationEmail)(userEmail, token, true);
        if (!emailRes.data)
            throw new customErrors_1.BadRequestError("Failed to send verification token!");
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            msg: "Successfully sent user setup token",
        });
    }
    catch (error) {
        throw new customErrors_1.BadRequestError("Unable to send verification token!");
    }
};
exports.sendVerificationToken = sendVerificationToken;
const newUserSetup = async (req, res) => {
    try {
        const hashedPassword = await (0, passwordUtil_1.hashPassword)(req.body.password);
        req.body.password = hashedPassword;
        const user = await User_1.default.findByIdAndUpdate(req.body.id, {
            ...req.body,
        }, { new: true });
        if (!user)
            throw new customErrors_1.NotFoundError("No user found!");
        // Generate email verification token
        const token = (0, token_1.createJWT)({ userId: user?._id?.toString() });
        // Send email
        const emailRes = await (0, emailServices_1.sendVerificationEmail)(user?.email, token);
        if (!emailRes.data)
            throw new customErrors_1.BadRequestError("Failed to send verification token!");
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: "Successfully setup user",
            success: true,
        });
    }
    catch (error) {
        console.error("User setup error", error);
        throw new customErrors_1.BadRequestError("User setup error");
    }
};
exports.newUserSetup = newUserSetup;
