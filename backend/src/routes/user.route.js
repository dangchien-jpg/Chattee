import express from "express";
import {
  getProfile,
  searchUserByUserName,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", getProfile);
router.get("/search", searchUserByUserName);

export default router;
