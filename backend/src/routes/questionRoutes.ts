import { Router } from "express";
import {
  getAllQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { USER_ROLE } from "../types/roles";

const router = Router();

// Public - get all questions (for test taking)
router.get("/", authenticate, getAllQuestions);
router.get("/:id", authenticate, getQuestion);

// Admin only
router.post("/", authenticate, authorize(USER_ROLE.ADMIN), createQuestion);
router.put("/:id", authenticate, authorize(USER_ROLE.ADMIN), updateQuestion);
router.delete("/:id", authenticate, authorize(USER_ROLE.ADMIN), deleteQuestion);

export default router;
