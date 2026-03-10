import Logout from "@/components/auth/Logout";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const ChatAppPage = () => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
      </SidebarProvider>
      <Logout />
    </div>
  );
};

export default ChatAppPage;
