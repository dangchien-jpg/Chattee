import conversationModel from "../models/conversation.model.js";
import friendModel from "../models/friend.model.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);
export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const receiverId = req.body?.receiverId ?? null;
    const memberIds = req.body?.memberIds ?? [];

    if (!receiverId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "memberIds or receiverId cannot blank" });
    }

    if (receiverId) {
      const [userA, userB] = pair(me, receiverId);
      const isFriend = await friendModel.findOne({ userA, userB });
      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "You are not friends with this user" });
      }
      return next();
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const friend = await friendModel.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      return res
        .status(403)
        .json({ message: "You are not friends with users", notFriends });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const checkGroupMemberShip = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await conversationModel.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not in this group" });
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
