import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getProperty,
  updateProperty,
} from "../controllers/propertyController";
import {
  validateInputProperty,
  validateProperty,
} from "../middleware/formValidationMiddleware";
import upload from "../middleware/multerMiddleware";

const router = Router();

router.post(
  "/",
  upload.array("images", 10),
  ...validateInputProperty,
  createProperty
);
router.get("/properties", getAllProperties);

router
  .route("/:id")
  .get(...validateProperty, getProperty)
  .patch(
    upload.array("images", 10),
    ...validateProperty,
    ...validateInputProperty,
    updateProperty
  )
  .delete(...validateProperty, deleteProperty);

export default router;
