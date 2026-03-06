import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import ms from "ms";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";

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
    await userModel.create({
      userName,
      displayName: `${lastName} ${firstName}`,
      hashedPassword: hashPassword,
      email,
    });

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signup failed" });
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
