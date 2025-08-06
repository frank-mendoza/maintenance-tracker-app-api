"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
const formValidationMiddleware_1 = require("../middleware/formValidationMiddleware");
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
const router = (0, express_1.Router)();
router.post("/create", multerMiddleware_1.default.array("images", 10), ...formValidationMiddleware_1.validateInputTickets, maintenanceController_1.createMaintenanceTicket);
router.get("/logs", maintenanceController_1.getMaintenanceLogs);
router
    .route("/:id")
    .get(...formValidationMiddleware_1.validateTicket, maintenanceController_1.getMaintenanceLogInfo)
    .patch(multerMiddleware_1.default.array("images", 10), ...formValidationMiddleware_1.validateTicket, ...formValidationMiddleware_1.validateInputTickets, maintenanceController_1.updateMaintenanceLog);
router
    .route("/:id/update-status")
    .patch(...formValidationMiddleware_1.validateTicket, ...formValidationMiddleware_1.validateUpdateTickets, maintenanceController_1.updateMaintenanceLogStatus);
exports.default = router;
