import api from "@/lib/axios";

export const friendService = {
  async searchByUserName(userName: string) {
    const res = await api.get(`/users/search?userName=${userName}`);

    return res.data.user;
  },

  async sendFriendRequest(receiverId: string, message?: string) {
    const res = await api.post(
      `/friends/requests`,
      { receiverId, message },
      { withCredentials: true },
    );

    return res.data.message;
  },

  async getAllFriendRequest() {
    try {
      const res = await api.get("/friends/requests");
      const { sent, received } = res.data;
      return { sent, received };
    } catch (error) {
      console.error(error);
    }
  },

  async acceptRequest(requestId: string) {
    try {
      return await api.post(`/friends/requests/${requestId}/accept`);
    } catch (error) {
      console.error(error);
    }
  },

  async declineRequest(requestId: string) {
    try {
      return await api.post(`/friends/requests/${requestId}/decline`);
    } catch (error) {
      console.error(error);
    }
  },
};
