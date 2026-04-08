import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "../src/routes/auth.route.js";
import userRoute from "../src/routes/user.route.js";
import friendRoute from "../src/routes/friend.route.js";
import messageRoute from "../src/routes/message.route.js";
import conversationRoute from "../src/routes/conversation.route.js";
import adminRoute from "../src/routes/admin.route.js";
import { connectDb } from "./configs/db.config.js";
import { protectedRoute } from "./middlewares/auth.middleware.js";
import { app, server } from "./socket/index.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const PORT = process.env.PORT;
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/admin", adminRoute);

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on: " + PORT);
  });
});
