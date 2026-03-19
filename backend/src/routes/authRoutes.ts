import { Router } from "express";
import { signup, verifySignupOTP, login, verifyOTP, getProfile } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validateSignup } from "../middleware/validate";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/verify-signup", verifySignupOTP);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/profile", authenticate, getProfile);

export default router;
