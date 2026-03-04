import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./configs/db.config.js";
import authRoute from "../src/routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
// middlewares
app.use(express.json());
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on: " + PORT);
  });
});
