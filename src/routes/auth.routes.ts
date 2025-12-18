import { Router } from "express";
import { login, logout, logoutAllDevices, refreshAccessToken, register } from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimiter.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, refreshTokenSchema, registerSchema } from "../utils/validation";


const router = Router();

// Apply rate limiting middleware to auth routes
if (process.env.NODE_ENV !== 'test') {
  router.use(authLimiter);
}

// Registration route
router.post("/register", validate(registerSchema), register);

// Login route
router.post("/login", validate(loginSchema), login);

// Additional auth routes (e.g., refresh token, logout) can be added here
router.post("/refresh-token", validate(refreshTokenSchema), refreshAccessToken);
router.post("/logout", validate(refreshTokenSchema), logout);
router.post("/logout-all-devices", logoutAllDevices);

export default router;