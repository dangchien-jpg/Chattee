import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "@/stores/useChatStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      setUser: (user) => {
        set({ user });
      },

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
      },

      signUp: async (userName, password, email, firstName, lastName) => {
        try {
          set({ loading: true });
          await authService.signUp(
            userName,
            password,
            email,
            firstName,
            lastName,
          );
        } catch (error) {
          console.error(error);
          toast.error("Có lỗi xảy ra khi đăng ký tài khoản");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (userName, password) => {
        try {
          get().clearState();
          set({ loading: true });
          const { accessToken } = await authService.signIn(userName, password);
          get().setAccessToken(accessToken);
          await get().fetchMe();
          useChatStore.getState().fetchConversations();
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
        } catch (error) {
          console.error(error);
          toast.error("Có lỗi xảy ra khi đăng xuất");
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Có lỗi xảy ra. Hãy thử lại!");
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe, setAccessToken } = get();
          const accessToken = await authService.refresh();
          setAccessToken(accessToken);
          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },

      verifyEmail: async (token) => {
        try {
          set({ loading: true });
          const res = await authService.verifyEmail(token);
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      resendEmail: async (email) => {
        try {
          set({ loading: true });
          const res = await authService.resendEmail(email);
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true });
          const res = await authService.forgotPassword(email);
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      resendOTP: async (email) => {
        try {
          set({ loading: true });
          const res = await authService.resendOTP(email);
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (email, newPassword, otp) => {
        try {
          set({ loading: true });
          const res = await authService.resetPassword(email, newPassword, otp);
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
