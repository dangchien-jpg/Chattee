import api from "@/lib/axios";

export const authService = {
  signUp: async (
    userName: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        userName,
        password,
        email,
        firstName,
        lastName,
      },
      { withCredentials: true },
    );
    return res.data;
  },

  signIn: async (userName: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      { userName, password },
      { withCredentials: true },
    );
    return res.data;
  },

  signOut: async () => {
    return await api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },

  verifyEmail: async (token: string) => {
    const res = await api.get(`/auth/verify-email?token=${token}`);

    return res.data;
  },

  resendEmail: async (email: string) => {
    const res = await api.post("/auth/resend-email", { email });
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  resendOTP: async (email: string) => {
    const res = await api.post("/auth/resend-otp", { email });
    return res.data;
  },

  resetPassword: async (email: string, newPassword: string, otp: string) => {
    const res = await api.patch("/auth/reset-password", {
      email,
      newPassword,
      otp,
    });
    return res.data;
  },
};
