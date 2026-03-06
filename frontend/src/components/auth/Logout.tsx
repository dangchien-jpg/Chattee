import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
