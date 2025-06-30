import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getProperty,
} from "../controllers/propertyController";
import { validateInputProperty } from "../middleware/formValidationMiddleware";
import upload from "../middleware/multerMiddleware";

const router = Router();

router.post(
  "/",
  upload.array("images", 5),
  ...validateInputProperty,
  createProperty
);
router.get("/all", getAllProperties);

router.route("/:id").get(getProperty);

export default router;
