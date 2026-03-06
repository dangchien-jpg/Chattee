import Logout from "@/components/auth/logout";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  console.log(user);

  return (
    <div>
      {user?.userName}
      <Logout />
    </div>
  );
};

export default ChatAppPage;
