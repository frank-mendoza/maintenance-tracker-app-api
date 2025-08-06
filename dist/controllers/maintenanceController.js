"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaintenanceLogStatus = exports.updateMaintenanceLog = exports.getMaintenanceLogInfo = exports.getMaintenanceLogs = exports.createMaintenanceTicket = void 0;
const User_1 = __importDefault(require("../models/User"));
const customErrors_1 = require("../errors/customErrors");
const http_status_codes_1 = require("http-status-codes");
const Property_1 = __importDefault(require("../models/Property"));
const MaintenanceLog_1 = __importDefault(require("../models/MaintenanceLog"));
const buildQuery_1 = require("../utils/buildQuery");
const paginationAndSort_1 = require("../utils/paginationAndSort");
const constants_1 = require("../utils/constants");
const cloudinary_1 = require("cloudinary");
const mediaUpload_1 = require("../utils/mediaUpload");
const helper_1 = require("../utils/helper");
const createMaintenanceTicket = async (req, res) => {
    try {
        const { reportedBy, assignedTo, propertyId } = req.body;
        const foundUser = await User_1.default.findOne({
            _id: reportedBy,
            role: "tenant",
        });
        if (!foundUser) {
            throw new customErrors_1.UnauthorizedError("Unauthorized!, reporter is not a tenant user");
        }
        const foundUserAssignee = await User_1.default.findOne({
            _id: assignedTo,
            role: "technician",
        });
        if (!foundUserAssignee) {
            throw new customErrors_1.UnauthorizedError("Unauthorized! Assignee User is not a technician");
        }
        const foundProperty = await Property_1.default.findById(propertyId);
        if (!foundProperty) {
            throw new customErrors_1.NotFoundError("No property found with that property ID");
        }
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            imageUrls = await (0, mediaUpload_1.uploadMultipleImages)(req.files, "maintenance-logs");
        }
        const ticket = await MaintenanceLog_1.default.create({
            ...req.body,
            images: imageUrls,
        });
        const assigneeProperties = foundUserAssignee.assignedRequests || [];
        assigneeProperties.push({
            property: foundProperty,
            status: "pending",
        });
        foundUserAssignee.assignedRequests = assigneeProperties;
        await foundUserAssignee.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: "Maintenance ticket created successfully",
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        if (error.name === "CastError") {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ msg: "Unable to find user with that ID", error: true });
            return;
        }
        throw new customErrors_1.BadRequestError("Failed to create ticket");
    }
};
exports.createMaintenanceTicket = createMaintenanceTicket;
const getMaintenanceLogs = async (req, res) => {
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
        const queryObject = (0, buildQuery_1.buildGenericQuery)({
            search: search,
            searchFields: ["title"],
            filters: {
                type,
                status,
                assignedTo,
                reportedBy,
            },
        });
        const { sortKey, skip } = (0, paginationAndSort_1.getPaginationAndSort)({
            sort: sort ? sort : sortOptions.newest,
            page,
            limit,
            sortOptions,
        });
        const maintenanceLogs = await MaintenanceLog_1.default.find(queryObject)
            .sort(sortKey)
            .skip(skip)
            .limit(limit)
            .populate([
            { path: "propertyId" },
            { path: "assignedTo" },
            { path: "reportedBy" },
            { path: "completedBy" },
        ]);
        const totalTickets = await MaintenanceLog_1.default.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalTickets / limit);
        const indexedTickets = maintenanceLogs.map((prop, index) => ({
            ...prop.toObject(),
            propertyId: null,
            property: prop.propertyId,
            index: skip + index + 1, // global index
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            total: totalTickets,
            numOfPages,
            currentPage: page,
            data: indexedTickets,
        });
    }
    catch (error) {
        console.log(error);
        throw new customErrors_1.BadRequestError("Failed to fetch maintenance logs");
    }
};
exports.getMaintenanceLogs = getMaintenanceLogs;
const getMaintenanceLogInfo = async (req, res) => {
    const maintenanceLog = await MaintenanceLog_1.default.findById(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        maintenanceLog,
    });
};
exports.getMaintenanceLogInfo = getMaintenanceLogInfo;
const updateMaintenanceLog = async (req, res) => {
    try {
        const ticket = await MaintenanceLog_1.default.findById(req.params.id);
        if (!ticket)
            throw new customErrors_1.NotFoundError("Ticket not found");
        const copyReq = req;
        const error = (0, helper_1.canChangeStatus)({
            current: ticket.status,
            next: req.body.status,
            req,
        });
        if (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: error,
                error: true,
            });
            return;
        }
        if (copyReq?.user?.userId !== req.body.reportedBy) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                msg: "Invalid assignee id",
                error: true,
            });
            return;
        }
        // replace old image so that it does not remain in cloudinary
        if (ticket.images && Array.isArray(ticket.images)) {
            for (const img of ticket.images) {
                if (img.public_id) {
                    await cloudinary_1.v2.uploader.destroy(img.public_id);
                }
            }
        }
        let newImageUrls = [];
        // upload new images if provided
        if (req.files && Array.isArray(req.files)) {
            newImageUrls = await (0, mediaUpload_1.uploadMultipleImages)(req.files, "properties");
        }
        const updatedTicket = await MaintenanceLog_1.default.findByIdAndUpdate(req.params.id, {
            ...req.body,
            images: newImageUrls,
        }, { new: true });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ maintenanceLog: updatedTicket, success: true });
    }
    catch (error) {
        console.error("Failed to update ticket:", error);
        throw new customErrors_1.BadRequestError("Failed to update ticket");
    }
};
exports.updateMaintenanceLog = updateMaintenanceLog;
const updateMaintenanceLogStatus = async (req, res) => {
    try {
        const ticket = await MaintenanceLog_1.default.findById(req.params.id);
        if (!ticket)
            throw new customErrors_1.NotFoundError("Ticket not found");
        const ticketStatus = (0, helper_1.canChangeStatus)({
            current: ticket.status,
            next: req.body.status,
            req,
        });
        if (ticketStatus.error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: ticketStatus.msg,
                error: true,
            });
            return;
        }
        const updatedTicket = await MaintenanceLog_1.default.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            comments: req.body.comments || null,
            nextStatus: ticketStatus.nextStatus,
            completedBy: req.body.status === constants_1.TIKET_STATUS.COMPLETED ? req.body.userId : null,
        }, { new: true });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ maintenanceLog: updatedTicket, success: true });
    }
    catch (error) {
        console.error("Failed to update ticket status:", error);
        throw new customErrors_1.BadRequestError("Failed to update ticket status");
    }
};
exports.updateMaintenanceLogStatus = updateMaintenanceLogStatus;
