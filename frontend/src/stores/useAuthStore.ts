import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (userName, password, email, firstName, lastName) => {
    try {
      set({ loading: true });
      await authService.signUp(userName, password, email, firstName, lastName);
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
      set({ loading: true });
      const { accessToken } = await authService.signIn(userName, password);
      get().setAccessToken(accessToken);
      await get().fetchMe();
      toast.success("Sign in successful");
    } catch (error) {
      console.error(error);
      toast.error("Username or password incorrect");
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
      toast.error("Session expired. Please sign in again.");
    } finally {
      set({ loading: false });
    }
  },
}));
