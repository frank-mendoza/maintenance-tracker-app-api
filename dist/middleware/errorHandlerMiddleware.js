"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof customErrors_1.NotFoundError ||
        err instanceof customErrors_1.BadRequestError ||
        err instanceof customErrors_1.UnauthenticatedError ||
        err instanceof customErrors_1.UnauthorizedError) {
        res.status(err.statusCode).json({ msg: err.message, error: true });
    }
    else {
        // Default handling for unexpected errors
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Something went wrong, try again later", error: true });
    }
    next();
};
exports.default = errorHandlerMiddleware;
