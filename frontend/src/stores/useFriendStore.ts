import { friendService } from "@/services/friendService";
import type { friendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<friendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],
  friends: [],
  notificationCount: 0,

  increaseNotificationCount: () => {
    set((state) => ({
      notificationCount: state.notificationCount + 1,
    }));
  },

  resetNotificationCount: () => {
    set({ notificationCount: 0 });
  },

  removeFriend: (friendId) => {
    set((state) => ({
      friends: state.friends.filter((f) => f._id !== friendId),
    }));
  },

  searchByUserName: async (userName) => {
    try {
      set({ loading: true });
      const user = await friendService.searchByUserName(userName);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addFriend: async (receiverId, message) => {
    try {
      set({ loading: true });
      const result = await friendService.sendFriendRequest(receiverId, message);
      return result;
    } catch (error) {
      console.error("Lỗi khi gửi lời mời:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addReceivedRequest: async (request) => {
    set((state) => ({
      receivedList: [request, ...state.receivedList],
    }));
  },

  addSentRequest: async (request) => {
    set((state) => ({
      sentList: [request, ...state.sentList],
    }));
  },

  getAllFriendRequests: async () => {
    try {
      set({ loading: true });
      const result = await friendService.getAllFriendRequest();
      if (!result) return;
      const { sent, received } = result;
      set({ receivedList: received, sentList: sent });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  acceptRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  declineRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  removeSentRequest: async (requestId) => {
    set((state) => ({
      sentList: state.sentList.filter((s) => s._id !== requestId),
    }));
  },

  removeReceivedRequest: async (requestId) => {
    set((state) => ({
      receivedList: state.receivedList.filter((s) => s._id !== requestId),
    }));
  },

  unFriend: async (friendId) => {
    try {
      set({ loading: true });
      const friend = await friendService.unFriend(friendId);
      set((state) => ({
        friends: state.friends.filter((f) => f._id !== friendId),
      }));
      return friend;
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getAllFriends: async () => {
    try {
      set({ loading: true });
      const friends = await friendService.getAllFriends();
      set({ friends: friends });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  cancelSentFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.cancelSentFriendRequest(requestId);
      set((state) => ({
        sentList: state.sentList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
