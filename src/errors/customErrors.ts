import { StatusCodes } from "http-status-codes";

/**
 * Base class for custom errors.
 */
export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    // Captures the stack trace excluding constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}

/**
 * 400 - Bad Request
 */
export class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

/**
 * 401 - Unauthenticated
 */
export class UnauthenticatedError extends CustomError {
  constructor(message = "Authentication required") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

/**
 * 403 - Forbidden
 */
export class UnauthorizedError extends CustomError {
  constructor(message = "Access denied") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
