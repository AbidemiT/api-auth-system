import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimiter.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../utils/validation";


const router = Router();

// Apply rate limiting middleware to auth routes
if (process.env.NODE_ENV !== 'test') {
  router.use(authLimiter);
}

// Registration route
router.post("/register", validate(registerSchema), register);

// Login route
router.post("/login", validate(loginSchema), login);

export default router;