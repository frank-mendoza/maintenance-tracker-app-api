"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const tenantsController_1 = require("../controllers/tenantsController");
const formValidationMiddleware_1 = require("../middleware/formValidationMiddleware");
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
const registerFields = {
    name: true,
    email: true,
    // phone: true,
    role: true,
    lastName: true,
};
const router = (0, express_1.Router)();
router.get("/", userController_1.getCurrentUser);
router.get("/all-users", tenantsController_1.getAllUsers);
router.post("/create", multerMiddleware_1.default.single("images"), ...(0, formValidationMiddleware_1.validateInputFields)(registerFields), tenantsController_1.createUser);
router
    .route("/:id")
    // .get(...validateProperty, getProperty)
    .patch(multerMiddleware_1.default.array("images", 2), ...formValidationMiddleware_1.validateUser, ...(0, formValidationMiddleware_1.validateInputFields)({
    name: true,
    phone: true,
    role: true,
    lastName: true,
}), tenantsController_1.updateUser)
    .delete(...formValidationMiddleware_1.validateUser, tenantsController_1.deleteUser);
exports.default = router;
