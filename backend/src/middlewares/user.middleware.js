import userModel from "../models/user.model.js";

export const validateUpdateProfile = async (req, res, next) => {
  const { userName, email, displayName } = req.body;

  if (!userName || !email || !displayName) {
    return res
      .status(400)
      .json({ message: "UserName, Email, Display Name can not blank" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  next();
};
