import { Request, Response } from "express";
import Question from "../models/Question";
import { AuthRequest } from "../middleware/auth";

// GET /api/questions
export const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { partNumber } = req.query;
    const filter: any = { testType: "PERSONALITY" };

    if (partNumber) {
      filter.partNumber = Number(partNumber);
    }

    const questions = await Question.find(filter).sort({
      partNumber: 1,
      questionNumber: 1,
    });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/questions/:id
export const getQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: "Question not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// POST /api/questions
export const createQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { partNumber, partName, questionNumber, questionText, options, correctAnswer } = req.body;

    const existing = await Question.findOne({
      testType: "PERSONALITY",
      partNumber,
      questionNumber,
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: `Question ${questionNumber} in Part ${partNumber} already exists.`,
      });
      return;
    }

    const question = await Question.create({
      testType: "PERSONALITY",
      partNumber,
      partName,
      questionNumber,
      questionText,
      options,
      correctAnswer,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully.",
      data: question,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// PUT /api/questions/:id
export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      res.status(404).json({
        success: false,
        message: "Question not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      data: question,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// DELETE /api/questions/:id
export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: "Question not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
