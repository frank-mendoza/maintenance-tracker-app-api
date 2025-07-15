import { Router } from "express";
import rateLimiter from "express-rate-limit";
import { validateInputFields } from "../middleware/formValidationMiddleware";
import {
  login,
  logout,
  newUserSetup,
  register,
  sendVerificationToken,
  verifyEmail,
  verifyUserSetup,
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
router.get("/verify-setup-token", verifyUserSetup);

router.post("/send-verification-token", sendVerificationToken);
router.post("/setup-user", newUserSetup);
export default router;
