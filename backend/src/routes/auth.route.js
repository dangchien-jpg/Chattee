import express from "express";
import {
  signIn,
  signUp,
  signOut,
  refreshToken,
  verify,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
  resendOTP,
} from "../controllers/auth.controller.js";
import { signInValidate } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/signup", signInValidate, signUp);
route.post("/signin", signIn);
route.post("/signout", signOut);
route.post("/refresh", refreshToken);
route.get("/verify-email", verify);
route.post("/resend-email", resendVerifyEmail);
route.post("/forgot-password", forgotPassword);
route.patch("/reset-password", resetPassword);
route.post("/resend-otp", resendOTP);

export default route;
