"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const formValidationMiddleware_1 = require("../middleware/formValidationMiddleware");
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
const router = (0, express_1.Router)();
router.post("/", multerMiddleware_1.default.array("images", 10), ...formValidationMiddleware_1.validateInputProperty, propertyController_1.createProperty);
router.get("/properties", propertyController_1.getAllProperties);
router
    .route("/:id")
    .get(...formValidationMiddleware_1.validateProperty, propertyController_1.getProperty)
    .patch(multerMiddleware_1.default.array("images", 10), ...formValidationMiddleware_1.validateProperty, ...formValidationMiddleware_1.validateInputProperty, propertyController_1.updateProperty)
    .delete(...formValidationMiddleware_1.validateProperty, propertyController_1.deleteProperty);
exports.default = router;
