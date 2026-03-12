import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { receiverId, content, conversationId } = req.body;
    const senderId = req.user._id;
    let conversation;
    if (!content) {
      return res.status(400).json({ message: "Content can not blank" });
    }

    if (conversationId) {
      conversation = await conversationModel.findById(conversationId);
    }

    if (!conversation) {
      conversation = await conversationModel.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: receiverId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await messageModel.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json({ message: "Content cannot blank" });
    }

    const message = await messageModel.create({
      conversationId,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
