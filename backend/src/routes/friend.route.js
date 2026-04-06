import express from "express";
import {
  acceptFriendRequest,
  sendFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
  unfriend,
  cancelSentFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/requests", sendFriendRequest);
router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/decline", declineFriendRequest);
router.delete("/requests/:requestId/cancel", cancelSentFriendRequest);
router.get("/", getAllFriends);
router.get("/requests", getFriendRequests);
router.delete("/:friendId", unfriend);

export default router;
