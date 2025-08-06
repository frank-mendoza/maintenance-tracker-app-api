import { Router } from "express";
import { getCurrentUser } from "../controllers/userController";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/tenantsController";
import {
  validateInputFields,
  validateUser,
} from "../middleware/formValidationMiddleware";
import upload from "../middleware/multerMiddleware";

const registerFields = {
  name: true,
  email: true,
  // phone: true,
  role: true,
  lastName: true,
};

const router = Router();

router.get("/", getCurrentUser);
router.get("/all-users", getAllUsers);
router.post(
  "/create",
  upload.single("images"),
  ...validateInputFields(registerFields),
  createUser
);

router
  .route("/:id")
  // .get(...validateProperty, getProperty)
  .patch(
    upload.array("images", 2),
    ...validateUser,
    ...validateInputFields({
      name: true,
      phone: true,
      role: true,
      lastName: true,
    }),
    updateUser
  )
  .delete(...validateUser, deleteUser);

export default router;
