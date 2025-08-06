"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    manuallyCreated: { type: Boolean, default: false },
    phone: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    role: {
        type: String,
        enum: ["tenant", "landlord", "technician"],
        default: "landlord",
    },
    assignedRequests: [
        {
            status: { type: String, required: true, default: "pending" },
            property: { type: mongoose_1.Schema.Types.ObjectId, ref: "Property" },
        },
    ],
    propertiesOwned: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Property" }],
    images: [
        {
            path: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
