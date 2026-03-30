import { userService } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { UserState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create<UserState>((set, get) => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });

        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Error: updateAvatarUrl", error);
      toast.error("Upload avatar không thành công");
    }
  },

  updateProfile: async (userName, displayName, email, phone, bio) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.updateProfile(
        userName,
        displayName,
        email,
        phone,
        bio,
      );

      if (user) {
        setUser({
          ...user,
          userName: data.userName,
          displayName: data.displayName,
          email: data.email,
          phone: data.phone,
        });
      }
    } catch (error) {
      console.error("Error: updateAvatarUrl", error);
      toast.error("Cập nhật trang cá nhân không thành công");
    }
  },
}));
