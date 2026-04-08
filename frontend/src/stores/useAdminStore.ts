import { adminService } from "@/services/adminService";
import type { AdminState } from "@/types/store";
import { create } from "zustand";

export const useAdminStore = create<AdminState>((set, get) => ({
  Users: [],
  loading: false,
  getAllUsers: async () => {
    try {
      set({ loading: true });
      const data = await adminService.getAllUser();
      set({ Users: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  blockUser: async (userId) => {
    try {
      set({ loading: true });
      const { status } = await adminService.blockUser(userId);
      set((state) => ({
        Users: state.Users.map((u) =>
          u._id === userId ? { ...u, status } : u,
        ),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
