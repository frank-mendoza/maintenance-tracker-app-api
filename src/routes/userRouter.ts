import { Router } from "express";
import rateLimiter from "express-rate-limit";
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
  phone: true,
  role: true,
  lastName: true,
};

const router = Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/", getCurrentUser);
router.get("/all-users", getAllUsers);
router.post(
  "/create",
  apiLimiter,
  ...validateInputFields(registerFields),
  createUser
);

router
  .route("/:id")
  // .get(...validateProperty, getProperty)
  .patch(
    upload.array("images", 10),
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
