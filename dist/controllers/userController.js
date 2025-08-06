"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const getCurrentUser = async (req, res) => {
    const user = await User_1.default.findOne({ _id: req.user.userId });
    const formattedUser = user?.toJSON();
    if (formattedUser) {
        delete formattedUser?.password; // Remove password from response
        delete formattedUser?.__v; // Remove __v from response
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: formattedUser,
        success: true,
    });
};
exports.getCurrentUser = getCurrentUser;
