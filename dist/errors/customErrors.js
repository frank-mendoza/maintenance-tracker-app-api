"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.UnauthenticatedError = exports.BadRequestError = exports.NotFoundError = exports.CustomError = void 0;
const http_status_codes_1 = require("http-status-codes");
/**
 * Base class for custom errors.
 */
class CustomError extends Error {
    statusCode;
    isOperational = true;
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        // Captures the stack trace excluding constructor
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
/**
 * 404 - Not Found
 */
class NotFoundError extends CustomError {
    constructor(message = "Resource not found") {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * 400 - Bad Request
 */
class BadRequestError extends CustomError {
    constructor(message = "Bad request") {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}
exports.BadRequestError = BadRequestError;
/**
 * 401 - Unauthenticated
 */
class UnauthenticatedError extends CustomError {
    constructor(message = "Authentication required") {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
/**
 * 403 - Forbidden
 */
class UnauthorizedError extends CustomError {
    constructor(message = "Access denied") {
        super(message, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
}
exports.UnauthorizedError = UnauthorizedError;
