import userModel from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const isAdmin = req.user.role;
    if (isAdmin !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not allowed to perform this action" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await userModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await userModel
      .find()
      .select("-hashedPassword")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin get all users: ", error);
    return res.status(500).json({ message: "Server errors" });
  }
};

export const block = async (req, res) => {
  try {
    const isAdmin = req.user.role;
    const userId = req.params.userId;
    if (isAdmin !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not allowed to perform this action" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.status === "banned") {
      return res.status(400).json({ message: "User already blocked" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { status: "banned" },
      { new: true },
    );

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Admin block user: ", error);
    return res.status(500).json({ message: "Server errors" });
  }
};
