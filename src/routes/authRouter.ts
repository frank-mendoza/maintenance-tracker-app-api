import { Router } from "express";
import rateLimiter from "express-rate-limit";
import { validateInputFields } from "../middleware/formValidationMiddleware";
import {
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/authController";

const router = Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

const registerFields = {
  name: true,
  email: true,
  password: true,
  lastName: true,
};

const loginFields = {
  email: true,
  password: true,
  isLogin: true,
};

router.post(
  "/register",
  apiLimiter,
  ...validateInputFields(registerFields),
  register
);

router.post("/login", apiLimiter, ...validateInputFields(loginFields), login);
router.get("/logout", logout);

router.get("/verify-email", verifyEmail);
export default router;
