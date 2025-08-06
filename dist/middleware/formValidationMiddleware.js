"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateInputTickets = exports.validateUpdateTickets = exports.validateTicket = exports.validateProperty = exports.validateInputProperty = exports.validateInputFields = void 0;
const express_validator_1 = require("express-validator");
const customErrors_1 = require("../errors/customErrors");
const User_1 = __importDefault(require("../models/User"));
const constants_1 = require("../utils/constants");
const Property_1 = __importDefault(require("../models/Property"));
const mongoose_1 = __importDefault(require("mongoose"));
const MaintenanceLog_1 = __importDefault(require("../models/MaintenanceLog"));
const withValidationErrors = (validatedValues) => {
    return [
        validatedValues,
        (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors
                    .array()
                    .map((error) => error.msg);
                // if (errorMessages[0].startsWith("no job")) {
                //   throw new NotFoundError(errorMessages[0]);
                // }
                if (errorMessages[0].startsWith("not authorized")) {
                    throw new customErrors_1.UnauthorizedError("not authorized to access this route");
                }
                console.error("Validation errors:", errorMessages);
                throw new customErrors_1.BadRequestError(errorMessages[0]);
            }
            next();
        },
    ];
};
const validateInputFields = (fields) => withValidationErrors([
    fields.name && (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    fields.email &&
        (0, express_validator_1.body)("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format")
            .custom(async (email) => {
            if (fields.isLogin)
                return; // Skip email check for login
            const user = await User_1.default.findOne({ email });
            if (user) {
                throw new customErrors_1.BadRequestError("Email already exists");
            }
        }),
    fields.password &&
        (0, express_validator_1.body)("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    fields.lastName &&
        (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required"),
    fields.phone && (0, express_validator_1.body)("phone").isNumeric().optional(),
    fields.role &&
        (0, express_validator_1.body)("role")
            .notEmpty()
            .isIn(Object.values(constants_1.USER_TYPES))
            .withMessage("Role is required"),
    fields.location &&
        (0, express_validator_1.body)("location").notEmpty().withMessage("Location is required"),
].filter(Boolean)); // remove falsy entries
exports.validateInputFields = validateInputFields;
exports.validateInputProperty = withValidationErrors([
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("location.town").notEmpty().withMessage("Town is required"),
    (0, express_validator_1.body)("location.province").notEmpty().withMessage("Province is required"),
    (0, express_validator_1.body)("description").isString().withMessage("Description must be a string"),
    (0, express_validator_1.body)("type")
        .isIn(Object.values(constants_1.APRTMENT_TYPE))
        .withMessage("invalid apartment type"),
    (0, express_validator_1.body)("rent")
        .isNumeric()
        .withMessage("Rent must be a number")
        .custom((val) => val >= 0)
        .withMessage("Rent must be 0 or greater"),
    (0, express_validator_1.body)("units")
        .isNumeric()
        .withMessage("Unit must be a number")
        .custom((val) => val >= 0)
        .withMessage("Unit must be 0 or greater"),
]); // remove falsy entries
exports.validateProperty = withValidationErrors([
    (0, express_validator_1.param)("id").custom(async (value) => {
        const isValidId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidId)
            throw new customErrors_1.BadRequestError("Invalid MongoDB id");
        const property = await Property_1.default.findById(value);
        if (!property)
            throw new customErrors_1.NotFoundError(`no property with id : ${value}`);
    }),
]);
exports.validateTicket = withValidationErrors([
    (0, express_validator_1.param)("id").custom(async (value) => {
        const isValidId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidId)
            throw new customErrors_1.BadRequestError("Invalid MongoDB id");
        const ticket = await MaintenanceLog_1.default.findById(value);
        if (!ticket)
            throw new customErrors_1.NotFoundError(`no ticket with id : ${value}`);
    }),
]);
exports.validateUpdateTickets = withValidationErrors([
    (0, express_validator_1.body)("userId").notEmpty().withMessage("User ID is required"),
    (0, express_validator_1.body)("status")
        .isIn(Object.values(constants_1.TIKET_STATUS))
        .withMessage("invalid ticket status type"),
]);
exports.validateInputTickets = withValidationErrors([
    (0, express_validator_1.body)("propertyId").notEmpty().withMessage("Property id is required"),
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Log Description is required"),
    (0, express_validator_1.body)("assignedTo")
        .notEmpty()
        .isString()
        .withMessage("Assignee must be a string"),
    (0, express_validator_1.body)("reportedBy")
        .notEmpty()
        .isString()
        .withMessage("Reportedby must be a string"),
]);
exports.validateUser = withValidationErrors([
    (0, express_validator_1.param)("id").custom(async (value) => {
        const isValidId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidId)
            throw new customErrors_1.BadRequestError("Invalid MongoDB id");
        const user = await User_1.default.findById(value);
        if (!user)
            throw new customErrors_1.NotFoundError(`no user with id : ${value}`);
    }),
]);
