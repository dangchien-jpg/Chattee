import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };
  return (
    <Button variant="completeGhost" onClick={handleLogout}>
      <LogOut className="text-destructive" />
      <span className="text-destructive">Đăng xuất</span>
    </Button>
  );
};

export default Logout;
