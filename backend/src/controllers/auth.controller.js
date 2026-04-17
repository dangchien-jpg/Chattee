import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import ms from "ms";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import { sendVerifyEmail } from "../utils/verifyEmail.js";
import { sendResetOTPEmail } from "../utils/sendOTP.js";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password, firstName, lastName } = req.body;
    const isUserName = await userModel.findOne({ userName });
    if (isUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const isEmail = await userModel.findOne({ email });
    if (isEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    await userModel.create({
      userName,
      displayName: `${lastName} ${firstName}`,
      hashedPassword: hashPassword,
      email,
      verifyToken,
      verifyTokenExpires: Date.now() + 10 * 60 * 1000, // 10 phút
      isVerified: false,
    });

    await sendVerifyEmail(verifyToken, email);

    return res.status(201).json({
      message: "Signup successful, please check your email to verify!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signup failed" });
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await userModel.findOne({
      verifyToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        code: "INVALID_OR_USED",
      });
    }

    if (user.verifyTokenExpires < Date.now()) {
      return res.status(400).json({
        message: "Expired token",
        code: "TOKEN_EXPIRED",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Email already verified",
        code: "ALREADY_VERIFIED",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Email verified successful",
      code: "VERIFY_SUCCESS",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      code: "SERVER_ERROR",
    });
  }
};

export const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, a verification email has been sent",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
        code: "ALREADY_VERIFIED",
      });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");

    user.verifyToken = verifyToken;
    user.verifyTokenExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendVerifyEmail(verifyToken, user.email);

    return res.json({
      message: "Verification email sent successfully",
      code: "RESEND_SUCCESS",
    });
  } catch (error) {
    console.error("Resend verify email error:", error);

    return res.status(500).json({
      message: "Failed to resend verification email",
      code: "SERVER_ERROR",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await userModel.findOne({ userName });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password incorrect" });
    }

    const comparePassword = await bcrypt.compare(password, user.hashedPassword);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: "Username or password incorrect" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Your email are not verified",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");
    await sessionModel.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + ms(process.env.REFRESH_TOKEN_TTL)),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms(process.env.REFRESH_TOKEN_TTL),
    });

    return res
      .status(200)
      .json({ message: "Signin successful", accessToken: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signin failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, an OTP has been sent",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.resetOTP = hashedOTP;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
    user.resetAttempts = 0;

    await user.save();

    await sendResetOTPEmail(user.email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      code: "OTP_SENT",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to send OTP",
      code: "SERVER_ERROR",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.resetOTP) {
      return res.status(400).json({
        message: "Invalid request",
        code: "INVALID_REQUEST",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOTP);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
        code: "INVALID_OTP",
      });
    }

    if (user.resetOTPExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired",
        code: "OTP_EXPIRED",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.hashedPassword = hashedPassword;

    user.resetOTP = null;
    user.resetOTPExpires = null;

    await user.save();

    return res.status(201).json({
      message: "Password reset successful",
      code: "RESET_SUCCESS",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
      code: "SERVER_ERROR",
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, an OTP has been sent",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.resetOTP = hashedOTP;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendResetOTPEmail(user.email, otp);

    return res.status(200).json({
      message: "OTP resent successfully",
      code: "RESEND_SUCCESS",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      message: "Failed to resend OTP",
      code: "SERVER_ERROR",
    });
  }
};

export const signOut = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    await sessionModel.deleteOne({ refreshToken: token });
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signout failed" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await sessionModel.findOne({ refreshToken: token });
    if (!session) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Expired token" });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL },
    );
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
