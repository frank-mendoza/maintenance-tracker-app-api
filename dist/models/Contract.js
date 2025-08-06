"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contractSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    parties: { type: [String], required: true },
    content: { type: String, required: true },
    dateIssued: { type: Date, default: Date.now },
    validUntil: { type: Date },
    signed: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Contract", contractSchema);
