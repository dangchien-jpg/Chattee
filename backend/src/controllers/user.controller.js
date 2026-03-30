import { uploadImageFromBuffer } from "../middlewares/upload.middleware.js";
import userModel from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Get profile failed" });
  }
};

export const searchUserByUserName = async (req, res) => {
  try {
    const { userName } = req.query;
    if (!userName || userName.trim() === "") {
      return res.status(400).json({ message: "Username can not blank" });
    }
    const user = await userModel
      .findOne({ userName })
      .select("_id displayName userName avatarUrl");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          avatarUrl: result.secure_url,
          avatarId: result.public_id,
        },
        {
          returnDocument: "after",
        },
      )
      .select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "Avatar return null" });
    }

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Avatar upload failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userName, email, displayName, phone, bio } = req.body;
    const userNameExists = await userModel.findOne({
      userName,
      _id: { $ne: userId },
    });
    if (userNameExists) {
      return res.status(400).json({ message: "UserName already exists" });
    }

    const emailExists = await userModel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        {
          userName: userName,
          email: email,
          displayName: displayName,
          phone: phone,
          bio: bio,
        },
        {
          returnDocument: "after",
        },
      )
      .select("_id userName displayName email phone bio");

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Upload profile failed" });
  }
};
