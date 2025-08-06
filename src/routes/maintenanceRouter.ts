import { Router } from "express";
import {
  createMaintenanceTicket,
  getMaintenanceLogInfo,
  getMaintenanceLogs,
  updateMaintenanceLog,
  updateMaintenanceLogStatus,
} from "../controllers/maintenanceController";
import {
  validateInputTickets,
  validateTicket,
  validateUpdateTickets,
} from "../middleware/formValidationMiddleware";
import upload from "../middleware/multerMiddleware";

const router = Router();

router.post(
  "/create",
  upload.array("images", 10),
  ...validateInputTickets,
  createMaintenanceTicket
);

router.get("/logs", getMaintenanceLogs);

router
  .route("/:id")
  .get(...validateTicket, getMaintenanceLogInfo)
  .patch(
    upload.array("images", 10),
    ...validateTicket,
    ...validateInputTickets,
    updateMaintenanceLog
  );

router
  .route("/:id/update-status")
  .patch(
    ...validateTicket,
    ...validateUpdateTickets,
    updateMaintenanceLogStatus
  );

export default router;
