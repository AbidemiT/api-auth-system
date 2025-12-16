import { Router } from "express";
import { register } from "../controllers/auth.controller";

const router = Router();

// Registration route
router.post("/register", register);

export default router;