import { Router } from "express";
import { login, register } from "../controllers/auth.controller";


const router = Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

export default router;