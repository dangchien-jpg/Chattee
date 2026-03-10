import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlenght: 300,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

friendRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
friendRequestSchema.index({ senderId: 1 });
friendRequestSchema.index({ receiverId: 1 });

export default mongoose.model("FriendRequest", friendRequestSchema);
