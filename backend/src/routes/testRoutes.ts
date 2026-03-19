import { Router } from "express";
import {
  startTest,
  submitTest,
  getMyResults,
  getResult,
  adminGetAllResults,
  adminGetStudents,
  adminGetStudentResults,
} from "../controllers/testController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { USER_ROLE } from "../types/roles";

const router = Router();

// Student routes
router.post("/start", authenticate, authorize(USER_ROLE.STUDENT), startTest);
router.put("/:id/submit", authenticate, authorize(USER_ROLE.STUDENT), submitTest);
router.get("/my-results", authenticate, authorize(USER_ROLE.STUDENT), getMyResults);
router.get("/result/:id", authenticate, getResult);

// Admin routes
router.get("/admin/results", authenticate, authorize(USER_ROLE.ADMIN), adminGetAllResults);
router.get("/admin/students", authenticate, authorize(USER_ROLE.ADMIN), adminGetStudents);
router.get("/admin/students/:studentId/results", authenticate, authorize(USER_ROLE.ADMIN), adminGetStudentResults);

export default router;
