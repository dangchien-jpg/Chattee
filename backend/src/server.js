import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "../src/routes/auth.route.js";
import userRoute from "../src/routes/user.route.js";
import friendRoute from "../src/routes/friend.route.js";
import messageRoute from "../src/routes/message.route.js";
import conversationRoute from "../src/routes/conversation.route.js";
import { connectDb } from "./configs/db.config.js";
import { protectedRoute } from "./middlewares/auth.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on: " + PORT);
  });
});
