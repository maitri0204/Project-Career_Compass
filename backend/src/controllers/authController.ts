import { Request, Response } from "express";
import User from "../models/User";
import { USER_ROLE } from "../types/roles";
import { generateToken } from "../utils/jwt";
import { generateOTP, hashOTP, compareOTP, isOTPExpired, getOTPExpiration } from "../utils/otp";
import { sendOTPEmail } from "../utils/email";
import { AuthRequest } from "../middleware/auth";

// POST /api/auth/signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, middleName, lastName, email, mobile, country, state, city, classGrade, schoolName, board } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      if (existingUser.isVerified) {
        res.status(400).json({
          success: false,
          message: "User already exists. Please login.",
        });
        return;
      }

      // Re-send OTP for unverified user
      const otp = generateOTP();
      console.log(`📧 [SIGNUP-RESEND] OTP for ${email}: ${otp}`);
      existingUser.otp = hashOTP(otp);
      existingUser.otpExpires = getOTPExpiration();
      existingUser.firstName = firstName;
      existingUser.middleName = middleName;
      existingUser.lastName = lastName;
      existingUser.mobile = mobile;
      existingUser.country = country;
      existingUser.state = state;
      existingUser.city = city;
      existingUser.classGrade = classGrade;
      existingUser.schoolName = schoolName;
      existingUser.board = board;
      await existingUser.save();

      await sendOTPEmail(email, firstName, otp, "signup");

      res.status(200).json({
        success: true,
        message: "OTP re-sent to your email.",
        data: { email: existingUser.email },
      });
      return;
    }

    const otp = generateOTP();
    console.log(`📧 [SIGNUP] OTP for ${email}: ${otp}`);
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      email: email.toLowerCase(),
      mobile,
      country,
      state,
      city,
      classGrade,
      schoolName,
      board,
      role: USER_ROLE.STUDENT,
      otp: hashOTP(otp),
      otpExpires: getOTPExpiration(),
    });

    await sendOTPEmail(email, firstName, otp, "signup");

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
      data: { email: user.email },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// POST /api/auth/verify-signup
export const verifySignupOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "User is already verified. Please login.",
      });
      return;
    }

    if (!user.otp || !user.otpExpires) {
      res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
      return;
    }

    if (isOTPExpired(user.otpExpires)) {
      res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    if (!compareOTP(otp, user.otp)) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
      return;
    }

    user.isVerified = true;
    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Account verified successfully!",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    console.error("Verify signup error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found. Please signup first.",
      });
      return;
    }

    if (!user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Account not verified. Please complete signup.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact admin.",
      });
      return;
    }

    const otp = generateOTP();
    console.log(`📧 [LOGIN] OTP for ${email}: ${otp}`);
    user.otp = hashOTP(otp);
    user.otpExpires = getOTPExpiration();
    await user.save();

    await sendOTPEmail(email, user.firstName, otp, "login");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
      data: { email: user.email },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// POST /api/auth/verify-otp
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    if (!user.otp || !user.otpExpires) {
      res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
      return;
    }

    if (isOTPExpired(user.otpExpires)) {
      res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    if (!compareOTP(otp, user.otp)) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
      return;
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/auth/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        country: user.country,
        state: user.state,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
