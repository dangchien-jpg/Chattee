import { friendService } from "@/services/friendService";
import type { friendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<friendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],

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
      console.error(error);
      throw error?.response?.data?.message || "Có lỗi xảy ra";
    } finally {
      set({ loading: false });
    }
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
}));
