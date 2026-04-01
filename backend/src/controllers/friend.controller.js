import friendModel from "../models/friend.model.js";
import userModel from "../models/user.model.js";
import friendRequestModel from "../models/friendRequest.model.js";
import { io } from "../socket/index.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (receiverId === senderId.toString()) {
      return res
        .status(400)
        .json({ message: "Unable to send invitations to myself." });
    }

    const userExist = await userModel.exists({ _id: receiverId });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    let userA = senderId.toString();
    let userB = receiverId.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      friendModel.findOne({ userA, userB }),
      friendRequestModel.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (existingRequest) {
      return res.status(400).json({ message: "A friend request is pending" });
    }

    const request = await friendRequestModel.create({
      senderId,
      receiverId,
      message,
    });

    const populateRequest = await request.populate([
      {
        path: "senderId",
        select: "_id displayName avatarUrl userName",
      },
      {
        path: "receiverId",
        select: "_id displayName avatarUrl userName",
      },
    ]);

    io.to(receiverId.toString()).emit("new-friend-request", populateRequest);
    io.to(senderId.toString()).emit("friend-request-sent", populateRequest);

    return res.status(200).json({
      message: "Your friend request has been sent successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await friendRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (request.receiverId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to accept this request" });
    }

    await friendModel.create({
      userA: request.senderId,
      userB: request.receiverId,
    });

    await friendRequestModel.findByIdAndDelete(requestId);

    const sender = await userModel
      .findById(request.senderId)
      .select("_id displayName avatarUrl")
      .lean();

    const senderId = request.senderId;
    io.to(senderId.toString()).emit("request-accepted", requestId);

    return res.status(200).json({
      message: "Friend request accepted successfully",
      newFriend: {
        _id: sender?._id,
        displayName: sender?.displayName,
        avatarUrl: sender?.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await friendRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (request.receiverId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to decline this request" });
    }

    await friendRequestModel.findByIdAndDelete(requestId);

    const senderId = request.senderId;

    io.to(senderId.toString()).emit("request-declined", requestId);
    return res
      .status(200)
      .json({ message: "Friend request declined successfully " });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await friendModel
      .find({
        $or: [
          {
            userA: userId,
          },
          { userB: userId },
        ],
      })
      .populate("userA", "_id displayName avatarUrl userName")
      .populate("userB", "_id displayName avatarUrl userName")
      .lean();

    if (!friendships.length) {
      return res.status(200).json({ friend: [] });
    }

    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA,
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const populateFields = "_id userName displayName avatarUrl";

    const [sent, received] = await Promise.all([
      friendRequestModel
        .find({ senderId: userId })
        .populate("receiverId", populateFields),
      friendRequestModel
        .find({ receiverId: userId })
        .populate("senderId", populateFields),
    ]);

    return res.status(200).json({ sent, received });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unfriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const friend = await friendModel.findOne({
      $or: [
        { userA: userId, userB: friendId },
        { userA: friendId, userB: userId },
      ],
    });

    if (!friend) {
      return res.status(404).json({ message: "Friendship Not found" });
    }

    const userA = friend.userA.toString();
    const userB = friend.userB.toString();

    await friend.deleteOne();

    io.to(userA).emit("unfriend", { userId: userB });
    io.to(userB).emit("unfriend", { userId: userA });

    return res.status(200).json({ message: "Unfriend success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
