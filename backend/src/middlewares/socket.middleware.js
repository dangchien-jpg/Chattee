import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(new Error("Invalid or expired token"));
    }

    const user = await userModel
      .findById(decoded.userId)
      .select("-hashedPassword");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    if (err.name === "TokenExpiredError") {
      return next(new Error("TOKEN_EXPIRED"));
    }
    console.error("Socket auth error:", err);
    return next(new Error("AUTH_FAILED"));
  }
};
