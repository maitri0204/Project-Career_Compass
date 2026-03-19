import { Request, Response, NextFunction } from "express";

export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { firstName, lastName, email } = req.body;

  const errors: string[] = [];

  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};
