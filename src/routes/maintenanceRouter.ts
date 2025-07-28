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

const router = Router();

router.post("/create", ...validateInputTickets, createMaintenanceTicket);

router.get("/logs", getMaintenanceLogs);

router
  .route("/:id")
  .get(...validateTicket, getMaintenanceLogInfo)
  .patch(...validateTicket, ...validateInputTickets, updateMaintenanceLog);

router
  .route("/:id/update-status")
  .patch(
    ...validateTicket,
    ...validateUpdateTickets,
    updateMaintenanceLogStatus
  );

export default router;
