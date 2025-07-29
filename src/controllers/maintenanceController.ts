import { Request, Response } from "express";
import User from "../models/User";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";
import Property from "../models/Property";
import MaintenanceLog from "../models/MaintenanceLog";
import { buildGenericQuery } from "../utils/buildQuery";
import { getPaginationAndSort } from "../utils/paginationAndSort";
import { TIKET_STATUS } from "../utils/constants";

export const createMaintenanceTicket = async (req: Request, res: Response) => {
  try {
    const { reportedBy, assignedTo, propertyId } = req.body;

    const foundUser = await User.findOne({
      _id: reportedBy,
      role: "tenant",
    });
    if (!foundUser) {
      throw new UnauthorizedError(
        "Unauthorized!, reporter is not a tenant user"
      );
    }

    const foundUserAssignee = await User.findOne({
      _id: assignedTo,
      role: "technician",
    });

    if (!foundUserAssignee) {
      throw new UnauthorizedError(
        "Unauthorized! Assignee User is not a technician"
      );
    }

    const foundProperty = await Property.findById(propertyId);

    if (!foundProperty) {
      throw new NotFoundError("No property found with that property ID");
    }

    const ticket = await MaintenanceLog.create({
      ...req.body,
    });

    const assigneeProperties = foundUserAssignee.assignedRequests || [];

    assigneeProperties.push({
      property: foundProperty,
      status: "pending",
    });
    foundUserAssignee.assignedRequests = assigneeProperties;

    await foundUserAssignee.save();

    res.status(StatusCodes.CREATED).json({
      msg: "Maintenance ticket created successfully",
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error(error);
    if (error.name === "CastError") {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Unable to find user with that ID", error: true });

      return;
    }

    throw new BadRequestError("Failed to create ticket");
  }
};

export const getMaintenanceLogs = async (req: Request, res: Response) => {
  try {
    const { search, type, status, sort, assignedTo, reportedBy } = req.query;

    // custom sort map for properties
    const sortOptions = {
      newest: "-createdAt",
      oldest: "createdAt",
      "a-z": "position",
      "z-a": "-position",
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const queryObject = buildGenericQuery({
      search: search as string,
      searchFields: ["title"],
      filters: {
        type,
        status,
        assignedTo,
        reportedBy,
      },
    });

    const { sortKey, skip } = getPaginationAndSort({
      sort: sort ? (sort as string) : sortOptions.newest,
      page,
      limit,
      sortOptions,
    });

    const maintenanceLogs = await MaintenanceLog.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "propertyId" },
        { path: "assignedTo" },
        { path: "reportedBy" },
        { path: "completedBy" },
      ]);

    const totalTickets = await MaintenanceLog.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalTickets / limit);

    const indexedTickets = maintenanceLogs.map((prop, index) => ({
      ...prop.toObject(),
      propertyId: null,
      property: prop.propertyId,
      index: skip + index + 1, // global index
    }));

    res.status(StatusCodes.CREATED).json({
      total: totalTickets,
      numOfPages,
      currentPage: page,
      data: indexedTickets,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Failed to fetch maintenance logs");
  }
};

export const getMaintenanceLogInfo = async (req: Request, res: Response) => {
  const maintenanceLog = await MaintenanceLog.findById(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    maintenanceLog,
  });
};

export const updateMaintenanceLog = async (req: Request, res: Response) => {
  try {
    const ticket = await MaintenanceLog.findById(req.params.id);
    if (!ticket) throw new NotFoundError("Ticket not found");

    const updatedTicket = await MaintenanceLog.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ maintenanceLog: updatedTicket, success: true });
  } catch (error) {
    console.error("Failed to update ticket:", error);
    throw new BadRequestError("Failed to update ticket");
  }
};

export const updateMaintenanceLogStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const ticket = await MaintenanceLog.findById(req.params.id);
    if (!ticket) throw new NotFoundError("Ticket not found");

    if (req.body.userId !== ticket.assignedTo.toString()) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid assignee id",
        error: true,
      });
      return;
    }
    if (!req.body.comments && req.body.status === TIKET_STATUS.DISCARDED) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Comments are required for discarded status",
        error: true,
      });
      return;
    }

    const updatedTicket = await MaintenanceLog.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        comments: req.body.comments || null,
        completedBy:
          req.body.status === TIKET_STATUS.COMPLETED ? req.body.userId : null,
      },
      { new: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ maintenanceLog: updatedTicket, success: true });
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    throw new BadRequestError("Failed to update ticket status");
  }
};
