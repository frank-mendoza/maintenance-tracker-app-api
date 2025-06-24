import { Router } from "express";
import {
  createProperty,
  getAllProperties,
} from "../controllers/propertyController";
import { validateInputProperty } from "../middleware/formValidationMiddleware";

const router = Router();

router.post("/", ...validateInputProperty, createProperty);
router.get("/all", getAllProperties);

export default router;
