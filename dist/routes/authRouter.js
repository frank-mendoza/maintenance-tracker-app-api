"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formValidationMiddleware_1 = require("../middleware/formValidationMiddleware");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
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
router.post("/register", ...(0, formValidationMiddleware_1.validateInputFields)(registerFields), authController_1.register);
router.post("/login", ...(0, formValidationMiddleware_1.validateInputFields)(loginFields), authController_1.login);
router.get("/logout", authController_1.logout);
router.get("/verify-email", authController_1.verifyEmail);
router.get("/verify-setup-token", authController_1.verifyUserSetup);
router.post("/send-verification-token", authController_1.sendVerificationToken);
router.post("/setup-user", authController_1.newUserSetup);
exports.default = router;
