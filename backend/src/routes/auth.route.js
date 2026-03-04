import express from "express";
import { signIn, signUp, signOut } from "../controllers/auth.controller.js";
import { signInValidate } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/signup", signInValidate, signUp);
route.post("/signin", signIn);
route.post("/signout", signOut);

export default route;
