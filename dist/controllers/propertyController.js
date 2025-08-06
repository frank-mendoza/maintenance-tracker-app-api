"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getProperty = exports.getAllProperties = exports.createProperty = void 0;
const http_status_codes_1 = require("http-status-codes");
const Property_1 = __importDefault(require("../models/Property"));
const customErrors_1 = require("../errors/customErrors");
const cloudinary_1 = require("cloudinary");
const paginationAndSort_1 = require("../utils/paginationAndSort");
const buildQuery_1 = require("../utils/buildQuery");
const mediaUpload_1 = require("../utils/mediaUpload");
const createProperty = async (req, res) => {
    try {
        const foundProperty = await Property_1.default.findOne({
            name: req.body.name,
        });
        if (foundProperty) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Property with this name already exists",
                error: true,
            });
            // throw new BadRequestError("Property with this name already exists");
        }
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            imageUrls = await (0, mediaUpload_1.uploadMultipleImages)(req.files, "properties");
        }
        const newProperty = await Property_1.default.create({
            ...req.body,
            images: imageUrls, // Store as an array of URLs
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: "Property created successfully",
            success: true,
            property: newProperty,
        });
    }
    catch (error) {
        throw new customErrors_1.BadRequestError("Failed to create property");
    }
};
exports.createProperty = createProperty;
const getAllProperties = async (req, res) => {
    try {
        const { search, type, status, sort } = req.query;
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
            searchFields: [
                "name",
                "location.town",
                "location.province",
                "tenants.name",
            ],
            filters: {
                type,
                status,
            },
        });
        const { sortKey, skip } = (0, paginationAndSort_1.getPaginationAndSort)({
            sort: sort,
            page,
            limit,
            sortOptions,
        });
        const properties = await Property_1.default.find(queryObject)
            .sort(sortKey)
            .skip(skip)
            .limit(limit);
        const totalProperties = await Property_1.default.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalProperties / limit);
        const indexedProperties = properties.map((prop, index) => ({
            ...prop.toObject(),
            index: skip + index + 1, // global index
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            total: totalProperties,
            numOfPages,
            currentPage: page,
            data: indexedProperties,
        });
    }
    catch (error) {
        throw new customErrors_1.BadRequestError("Failed to fetch properties");
    }
};
exports.getAllProperties = getAllProperties;
const getProperty = async (req, res) => {
    const property = await Property_1.default.findById(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        property,
    });
};
exports.getProperty = getProperty;
const updateProperty = async (req, res) => {
    try {
        const property = await Property_1.default.findById(req.params.id);
        if (!property)
            throw new customErrors_1.NotFoundError("Property not found");
        if (property.images && Array.isArray(property.images)) {
            for (const img of property.images) {
                if (img.public_id) {
                    await cloudinary_1.v2.uploader.destroy(img.public_id);
                }
            }
        }
        let newImageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            newImageUrls = await (0, mediaUpload_1.uploadMultipleImages)(req.files, "properties");
        }
        // 🧩 Step 4: update property, include combined images
        const updatedProperty = await Property_1.default.findByIdAndUpdate(req.params.id, {
            ...req.body,
            images: newImageUrls,
        }, { new: true });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ property: updatedProperty, success: true });
    }
    catch (error) {
        console.error("Error updating property:", error);
        throw new customErrors_1.BadRequestError("Failed to update property");
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    const removedProperty = await Property_1.default.findByIdAndDelete(req.params.id);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        property: removedProperty,
        success: true,
        msg: "Successfully removed property",
    });
};
exports.deleteProperty = deleteProperty;
