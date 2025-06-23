import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import { Response } from "express";

export const getCurrentUser = async (req: any, res: Response) => {
  const user = await User.findOne({ _id: req.user.userId });

  const formattedUser: any = user?.toJSON();
  if (formattedUser) {
    delete formattedUser?.password; // Remove password from response
    delete formattedUser?.__v; // Remove __v from response
  }
  res.status(StatusCodes.OK).json({
    user: formattedUser,
  });
};
