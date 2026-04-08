import api from "@/lib/axios";

export const adminService = {
  getAllUser: async () => {
    const res = await api.get("/admin/users");

    return res.data.users;
  },

  blockUser: async (userId: string) => {
    const res = await api.patch(`/admin/${userId}/block`);

    return res.data.user;
  },
};
