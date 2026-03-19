import { Request, Response } from "express";
import Question from "../models/Question";
import TestResult from "../models/TestResult";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// Personality dimension mapping
const DIMENSION_MAP: Record<number, { a: string; b: string }> = {
  1: { a: "E", b: "I" },
  2: { a: "S", b: "N" },
  3: { a: "T", b: "F" },
  4: { a: "J", b: "P" },
};

const DIMENSION_NAMES: Record<string, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
};

const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  ISTJ: "The Inspector – Responsible, thorough, and dependable. You value tradition and loyalty.",
  ISFJ: "The Protector – Warm, considerate, and dedicated to helping others in a practical way.",
  INFJ: "The Counselor – Insightful, principled, and compassionate. You seek meaning and connection.",
  INTJ: "The Mastermind – Strategic, determined, and independent. You love complex challenges.",
  ISTP: "The Craftsman – Observant, analytical, and hands-on. You enjoy understanding how things work.",
  ISFP: "The Composer – Gentle, sensitive, and artistic. You live in the moment and value harmony.",
  INFP: "The Healer – Idealistic, empathetic, and creative. You strive to make the world better.",
  INTP: "The Architect – Logical, innovative, and curious. You love exploring ideas and theories.",
  ESTP: "The Dynamo – Energetic, pragmatic, and action-oriented. You thrive on excitement.",
  ESFP: "The Performer – Spontaneous, fun-loving, and sociable. You bring joy to those around you.",
  ENFP: "The Champion – Enthusiastic, creative, and people-oriented. You see potential everywhere.",
  ENTP: "The Visionary – Quick-witted, clever, and outspoken. You love intellectual challenges.",
  ESTJ: "The Supervisor – Organized, logical, and assertive. You take charge and get things done.",
  ESFJ: "The Provider – Caring, social, and traditional. You prioritize harmony and cooperation.",
  ENFJ: "The Teacher – Charismatic, empathetic, and organized. You inspire and lead others.",
  ENTJ: "The Commander – Bold, imaginative, and strong-willed. You are a natural leader.",
};

function computePersonality(answers: Map<string, string>, questions: any[]) {
  const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((q) => {
    const answer = answers.get(q._id.toString());
    if (!answer) return;

    const dim = DIMENSION_MAP[q.partNumber];
    if (!dim) return; // Part 5 questions are reflection, skip

    if (answer === "A") {
      counts[dim.a]++;
    } else if (answer === "B") {
      counts[dim.b]++;
    }
  });

  const pairs = [
    { a: "E", b: "I" },
    { a: "S", b: "N" },
    { a: "T", b: "F" },
    { a: "J", b: "P" },
  ];

  let personalityType = "";
  const dimensions = pairs.map(({ a, b }) => {
    const total = counts[a] + counts[b];
    const percentA = total > 0 ? Math.round((counts[a] / total) * 100) : 50;
    const percentB = total > 0 ? Math.round((counts[b] / total) * 100) : 50;
    const winner = counts[a] >= counts[b] ? a : b;
    personalityType += winner;

    return {
      pair: `${a}/${b}`,
      letterA: a,
      letterB: b,
      nameA: DIMENSION_NAMES[a],
      nameB: DIMENSION_NAMES[b],
      countA: counts[a],
      countB: counts[b],
      percentA,
      percentB,
      winner,
    };
  });

  return {
    personalityType,
    description: PERSONALITY_DESCRIPTIONS[personalityType] || "",
    dimensions,
    totalAnswered: Array.from(answers.values()).filter(Boolean).length,
  };
}

// POST /api/test/start
export const startTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user._id;

    // Check if there's an in-progress test
    const existing = await TestResult.findOne({
      student: studentId,
      status: "IN_PROGRESS",
    });

    if (existing) {
      res.status(200).json({
        success: true,
        message: "You have an in-progress test.",
        data: existing,
      });
      return;
    }

    // Get all personality questions
    const questions = await Question.find({ testType: "PERSONALITY" }).sort({
      partNumber: 1,
      questionNumber: 1,
    });

    if (questions.length === 0) {
      res.status(400).json({
        success: false,
        message: "No questions available. Please contact admin.",
      });
      return;
    }

    const testResult = await TestResult.create({
      student: studentId,
      status: "IN_PROGRESS",
      answers: new Map(),
    });

    res.status(201).json({
      success: true,
      message: "Test started successfully.",
      data: {
        testId: testResult._id,
        questions,
      },
    });
  } catch (error: any) {
    console.error("Start test error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// PUT /api/test/:id/submit
export const submitTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // { questionId: "A" or "B", ... }

    const testResult = await TestResult.findOne({
      _id: id,
      student: req.user._id,
    });

    if (!testResult) {
      res.status(404).json({
        success: false,
        message: "Test not found.",
      });
      return;
    }

    if (testResult.status === "COMPLETED") {
      res.status(400).json({
        success: false,
        message: "Test already submitted.",
      });
      return;
    }

    // Save answers
    const answerMap = new Map<string, string>(Object.entries(answers));
    testResult.answers = answerMap;

    // Get all questions to compute personality
    const questions = await Question.find({ testType: "PERSONALITY" });
    const result = computePersonality(answerMap, questions);

    testResult.personalityType = result.personalityType;
    testResult.totalScore = result.totalAnswered;
    testResult.status = "COMPLETED";
    testResult.submittedAt = new Date();

    await testResult.save();

    res.status(200).json({
      success: true,
      message: "Test submitted successfully!",
      data: {
        testId: testResult._id,
        personalityType: result.personalityType,
        description: result.description,
        dimensions: result.dimensions,
      },
    });
  } catch (error: any) {
    console.error("Submit test error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/test/my-results
export const getMyResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const results = await TestResult.find({
      student: req.user._id,
      status: "COMPLETED",
    }).sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/test/result/:id
export const getResult = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const testResult = await TestResult.findById(req.params.id).populate(
      "student",
      "firstName lastName email"
    );

    if (!testResult) {
      res.status(404).json({
        success: false,
        message: "Result not found.",
      });
      return;
    }

    // Only allow owner or admin
    const isOwner = testResult.student &&
      (testResult.student as any)._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "Access denied.",
      });
      return;
    }

    // Re-compute personality breakdown
    const questions = await Question.find({ testType: "PERSONALITY" });
    const breakdown = computePersonality(testResult.answers, questions);

    res.status(200).json({
      success: true,
      data: {
        _id: testResult._id,
        student: testResult.student,
        status: testResult.status,
        personalityType: testResult.personalityType,
        totalScore: testResult.totalScore,
        submittedAt: testResult.submittedAt,
        personality: breakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/test/admin/results
export const adminGetAllResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const results = await TestResult.find({ status: "COMPLETED" })
      .populate("student", "firstName lastName email")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/test/admin/students/:studentId/results
export const adminGetStudentResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const results = await TestResult.find({
      student: studentId,
      status: "COMPLETED",
    })
      .populate("student", "firstName middleName lastName email")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/test/admin/students
export const adminGetStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const students = await User.find({ role: "STUDENT" })
      .select("-otp -otpExpires")
      .sort({ createdAt: -1 });

    // Get test results count for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const completedTests = await TestResult.countDocuments({
          student: student._id,
          status: "COMPLETED",
        });
        return {
          ...student.toObject(),
          completedTests,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentsWithStats.length,
      data: studentsWithStats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
