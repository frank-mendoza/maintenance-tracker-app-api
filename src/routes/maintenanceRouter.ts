import { Router } from "express";
import {
  createMaintenanceTicket,
  getMaintenanceLogs,
} from "../controllers/maintenanceController";
import { validateInputTickets } from "../middleware/formValidationMiddleware";

const router = Router();

router.post("/", ...validateInputTickets, createMaintenanceTicket);

router.get("/logs", getMaintenanceLogs);

export default router;
