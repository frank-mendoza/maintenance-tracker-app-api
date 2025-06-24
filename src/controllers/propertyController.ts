import { StatusCodes } from "http-status-codes";
import Property from "../models/Property";
import { Request, Response } from "express";
import { BadRequestError } from "../errors/customErrors";

export const createProperty = async (req: Request, res: Response) => {
  try {
    const foundProperty = await Property.findOne({
      name: req.body.name,
    });

    if (foundProperty) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Name already exist", error: true });
      return;
    }

    const newProperty = await Property.create({ ...req.body });

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

    if (type && type !== "all") {
      queryObject.type = type;
    }

    if (status && status !== "all") {
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
  try {
    const property = await Property.findById(req.params.id);
  } catch (error) {}
};
