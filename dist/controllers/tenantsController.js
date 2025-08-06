"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const buildQuery_1 = require("../utils/buildQuery");
const paginationAndSort_1 = require("../utils/paginationAndSort");
const customErrors_1 = require("../errors/customErrors");
const User_1 = __importDefault(require("../models/User"));
const token_1 = require("../utils/token");
const cloudinary_1 = require("cloudinary");
const emailServices_1 = require("../utils/emailServices");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const getAllUsers = async (req, res) => {
    try {
        const { search, role, status, sort } = req.query;
        // custom sort map for users
        const sortOptions = {
            newest: "-createdAt",
            oldest: "createdAt",
            "a-z": "position",
            "z-a": "-position",
        };
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        let parsedStatus;
        if (status === "verified")
            parsedStatus = true;
        else if (status === "unverified")
            parsedStatus = false;
        else
            parsedStatus = undefined;
        const queryObject = (0, buildQuery_1.buildGenericQuery)({
            search: search,
            searchFields: ["name", "lastName", "lastName", "email", "role"],
            filters: {
                role,
                isVerified: parsedStatus,
            },
        });
        const { sortKey, skip } = (0, paginationAndSort_1.getPaginationAndSort)({
            sort: sort ? sort : sortOptions.newest,
            page,
            limit,
            sortOptions,
        });
        const users = await User_1.default.find(queryObject)
            .sort(sortKey)
            .skip(skip)
            .limit(limit);
        const totalUsers = await User_1.default.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalUsers / limit);
        const indexedUsers = users.map((user, index) => ({
            ...user.toObject(),
            index: skip + index + 1, // global index
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            total: totalUsers,
            numOfPages,
            currentPage: page,
            data: indexedUsers,
        });
    }
    catch (error) {
        throw new customErrors_1.BadRequestError("Failed to fetch users");
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        const userExists = await User_1.default.findOne({ email: req.body.email });
        if (userExists) {
            throw new customErrors_1.BadRequestError("User with this email already exists!");
        }
        const newUser = await User_1.default.create({ ...req.body });
        newUser.manuallyCreated = true; // Mark as manually created
        newUser.save(); // Save the user with the manuallyCreated flag
        // Generate email verification token
        const token = (0, token_1.createJWT)({ userId: newUser._id?.toString() });
        // Send email
        const emailRes = await (0, emailServices_1.sendVerificationEmail)(newUser.email, token, true);
        if (!emailRes.data)
            throw new customErrors_1.BadRequestError("Failed to send verification token!");
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: "User created successfully",
            user: newUser,
            success: true,
        });
    }
    catch (error) {
        throw new customErrors_1.BadRequestError("Failed to create user");
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user)
            throw new customErrors_1.NotFoundError("User not found");
        if (Array.isArray(req.files) && req.files.length > 1) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ msg: "Only 1 profile picture is needed", error: true });
            return;
        }
        if (user.images && Array.isArray(user.images)) {
            for (const img of user.images) {
                if (img.public_id) {
                    await cloudinary_1.v2.uploader.destroy(img.public_id);
                }
            }
        }
        const newImageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const file64 = (0, multerMiddleware_1.formatImage)(file);
                if (typeof file64 === "string") {
                    const uploadRes = await cloudinary_1.v2.uploader.upload(file64, {
                        folder: "properties",
                    });
                    newImageUrls.push({
                        path: uploadRes.secure_url,
                        public_id: uploadRes.public_id,
                    });
                }
                else {
                    throw new customErrors_1.BadRequestError("Invalid image format");
                }
            }
        }
        // 🧩 Step 4: update user, include combined images
        const updatedUser = await User_1.default.findByIdAndUpdate(req.params.id, {
            ...req.body,
            images: newImageUrls,
        }, { new: true });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ user: updatedUser, success: true, msg: "Successfully updated" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw new customErrors_1.BadRequestError("Failed to update user");
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const user = await User_1.default.findByIdAndDelete(req.params.id);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ user, success: true, msg: "Successfully removed user" });
};
exports.deleteUser = deleteUser;
