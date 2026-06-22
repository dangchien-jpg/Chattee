import api from "@/lib/axios";

export const adminService = {
  getAllUser: async (page: number = 1, limit: number = 10) => {
    const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return res.data;
  },

  blockUser: async (userId: string) => {
    const res = await api.patch(`/admin/${userId}/block`);

    return res.data.user;
  },
};
