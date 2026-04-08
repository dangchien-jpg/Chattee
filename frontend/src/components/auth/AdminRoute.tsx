import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

export const AdminRoute = () => {
  const { user } = useAuthStore();

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
