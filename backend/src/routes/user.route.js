import express from "express";
import {
  getProfile,
  searchUserByUserName,
  updateProfile,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validateUpdateProfile } from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/me", getProfile);
router.get("/search", searchUserByUserName);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
router.put("/update", validateUpdateProfile, updateProfile);

export default router;
