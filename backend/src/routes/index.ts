import { Router } from "express";
import authRoutes from "./authRoutes";
import questionRoutes from "./questionRoutes";
import testRoutes from "./testRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/questions", questionRoutes);
router.use("/test", testRoutes);

export default router;
