"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const customErrors_1 = require("../errors/customErrors");
const token_1 = require("../utils/token");
const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token)
        throw new customErrors_1.UnauthenticatedError("Authentication Invalid");
    try {
        const payload = (0, token_1.verifyJWT)(token);
        req.user = { userId: payload.userId, role: payload.role };
        next();
    }
    catch (error) {
        throw new customErrors_1.UnauthenticatedError("Authentication Invalid");
    }
};
exports.authenticateUser = authenticateUser;
