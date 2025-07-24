import { Router } from "express";
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

router.post("/register", ...validateInputFields(registerFields), register);

router.post("/login", ...validateInputFields(loginFields), login);
router.get("/logout", logout);

router.get("/verify-email", verifyEmail);
router.get("/verify-setup-token", verifyUserSetup);

router.post("/send-verification-token", sendVerificationToken);
router.post("/setup-user", newUserSetup);
export default router;
