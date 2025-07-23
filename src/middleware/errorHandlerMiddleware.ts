import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors";

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err instanceof NotFoundError ||
    err instanceof BadRequestError ||
    err instanceof UnauthenticatedError ||
    err instanceof UnauthorizedError
  ) {
    res.status(err.statusCode).json({ msg: err.message, error: true });
  } else {
    // Default handling for unexpected errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later", error: true });
  }
  next();
};

export default errorHandlerMiddleware;
