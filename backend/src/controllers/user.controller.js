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
