import { StatusCodes } from "http-status-codes";
import Property from "../models/Property";
import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors/customErrors";
import { formatImage } from "../middleware/multerMiddleware";

import { v2 as cloudinary } from "cloudinary";

export const createProperty = async (req: Request, res: Response) => {
  try {
    const foundProperty = await Property.findOne({
      name: req.body.name,
    });

    if (foundProperty) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Property with this name already exists",
        error: true,
      });
      // throw new BadRequestError("Property with this name already exists");
    }

    const imageUrls: { path: string; public_id: string }[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const file64 = formatImage(file);
        if (typeof file64 === "string") {
          const uploadRes = await cloudinary.uploader.upload(file64, {
            folder: "properties",
          });
          imageUrls.push({
            path: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          });
        } else {
          throw new BadRequestError("Invalid image format");
        }
      }
    }

    const newProperty = await Property.create({
      ...req.body,
      images: imageUrls, // Store as an array of URLs
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Property created successfully",
      success: true,
      property: newProperty,
    });
  } catch (error) {
    throw new BadRequestError("Failed to create property");
  }
};

export const getAllProperties = async (req: any, res: any) => {
  try {
    const { search, type, status, sort } = req.query;

    const queryObject: any = {
      //   createdBy: req.user.userId,
    };

    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { "location.town": { $regex: search, $options: "i" } },
        { "location.province": { $regex: search, $options: "i" } },
        { "tenants.name": { $regex: search, $options: "i" } },
      ];
    }

    if (type && type !== "") {
      queryObject.type = type;
    }

    if (status && status !== "") {
      queryObject.status = status;
    }

    const sortOptions = {
      newest: "-createdAt",
      oldest: "createdAt",
      "a-z": "position",
      "z-a": "-position",
    };

    const sortKey =
      sortOptions[sort as keyof typeof sortOptions] || sortOptions.newest;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);

    const totalProperties = await Property.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalProperties / limit);

    res
      .status(StatusCodes.CREATED)
      .json({ totalProperties, numOfPages, currentPage: page, properties });
  } catch (error) {
    throw new BadRequestError("Failed to fetch properties");
  }
};

export const getProperty = async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    property,
  });
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) throw new NotFoundError("Property not found");

    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
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

    // 🧩 Step 4: update property, include combined images
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: newImageUrls,
      },
      { new: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ property: updatedProperty, success: true });
  } catch (error) {
    console.error("Error updating property:", error);
    throw new BadRequestError("Failed to update property");
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  const removedProperty = await Property.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({ property: removedProperty });
};
