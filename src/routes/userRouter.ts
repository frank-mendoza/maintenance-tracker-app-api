import { Router } from "express";
import { getCurrentUser } from "../controllers/userController";

const router = Router();

router.get("/", getCurrentUser);

export default router;
