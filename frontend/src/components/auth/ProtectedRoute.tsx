import { SpinnerCustom } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFriendStore } from "@/stores/useFriendStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const { getAllFriends } = useFriendStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Xảy ra khi refresh trang
      if (!accessToken) {
        await refresh();
      }

      if (accessToken && !user) {
        await fetchMe();
      }

      if (user) {
        await getAllFriends();
      }

      setStarting(false);
    };
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-popover">
        <SpinnerCustom />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to={"/signin"} replace />;
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
