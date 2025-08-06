"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = void 0;
const cloudinary_1 = require("cloudinary");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const customErrors_1 = require("../errors/customErrors");
const uploadMultipleImages = async (files, folder = "default-folder") => {
    const imageUrls = [];
    for (const file of files) {
        const file64 = (0, multerMiddleware_1.formatImage)(file);
        if (typeof file64 !== "string") {
            throw new customErrors_1.BadRequestError("Invalid image format");
        }
        const uploadRes = await cloudinary_1.v2.uploader.upload(file64, { folder });
        imageUrls.push({
            path: uploadRes.secure_url,
            public_id: uploadRes.public_id,
        });
    }
    return imageUrls;
};
exports.uploadMultipleImages = uploadMultipleImages;
