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
          toast.success("Sign up successful");
        } catch (error) {
          console.error(error);
          toast.error("Sign up failed");
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
          toast.success("Sign out successful");
        } catch (error) {
          console.error(error);
          toast.error("Sign out failed");
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
          toast.error("An error occurred. Please try again");
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
