import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const signInValidate = (req, res, next) => {
  const { userName, email, password, firstName, lastName } = req.body;
  if (!userName || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  next();
};

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }

        const user = await userModel
          .findById(decodedUser.userId)
          .select("-hashedPassword");
        if (!user) {
          return res.status(404).json({ message: "User not found " });
        }

        req.user = user;

        next();
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
