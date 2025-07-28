import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { buildGenericQuery } from "../utils/buildQuery";
import { getPaginationAndSort } from "../utils/paginationAndSort";
import { BadRequestError, NotFoundError } from "../errors/customErrors";
import User from "../models/User";
import { createJWT } from "../utils/token";

import { v2 as cloudinary } from "cloudinary";
import { sendVerificationEmail } from "../utils/emailServices";
import { formatImage } from "../middleware/multerMiddleware";

export const getAllUsers = async (req: any, res: any) => {
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

    let parsedStatus: boolean | undefined;
    if (status === "verified") parsedStatus = true;
    else if (status === "unverified") parsedStatus = false;
    else parsedStatus = undefined;

    const queryObject = buildGenericQuery({
      search: search as string,
      searchFields: ["name", "lastName", "lastName", "email", "role"],
      filters: {
        role,
        isVerified: parsedStatus,
      },
    });

    const { sortKey, skip } = getPaginationAndSort({
      sort: sort ? (sort as string) : sortOptions.newest,
      page,
      limit,
      sortOptions,
    });

    const users = await User.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalUsers / limit);

    const indexedUsers = users.map((user, index) => ({
      ...user.toObject(),
      index: skip + index + 1, // global index
    }));

    res.status(StatusCodes.CREATED).json({
      total: totalUsers,
      numOfPages,
      currentPage: page,
      data: indexedUsers,
    });
  } catch (error) {
    throw new BadRequestError("Failed to fetch users");
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      throw new BadRequestError("User with this email already exists!");
    }
    const newUser = await User.create({ ...req.body });

    newUser.manuallyCreated = true; // Mark as manually created

    newUser.save(); // Save the user with the manuallyCreated flag
    // Generate email verification token
    const token = createJWT({ userId: newUser._id?.toString() });

    // Send email
    const emailRes = await sendVerificationEmail(newUser.email, token, true);

    if (!emailRes.data)
      throw new BadRequestError("Failed to send verification token!");

    res.status(StatusCodes.CREATED).json({
      msg: "User created successfully",
      user: newUser,
      success: true,
    });
  } catch (error) {
    throw new BadRequestError("Failed to create user");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError("User not found");

    if (Array.isArray(req.files) && req.files.length > 1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Only 1 profile picture is needed", error: true });
      return;
    }

    if (user.images && Array.isArray(user.images)) {
      for (const img of user.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    const newImageUrls: { path: string; public_id: string }[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const file64 = formatImage(file);
        if (typeof file64 === "string") {
          const uploadRes = await cloudinary.uploader.upload(file64, {
            folder: "properties",
          });
          newImageUrls.push({
            path: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          });
        } else {
          throw new BadRequestError("Invalid image format");
        }
      }
    }

    // 🧩 Step 4: update user, include combined images
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: newImageUrls,
      },
      { new: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ user: updatedUser, success: true, msg: "Successfully updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new BadRequestError("Failed to update user");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res
    .status(StatusCodes.OK)
    .json({ user, success: true, msg: "Successfully removed user" });
};
