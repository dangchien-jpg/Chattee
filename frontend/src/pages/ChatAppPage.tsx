import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import ChatWindowLayout from "@/components/chat/chatWindowLayout";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full p-6">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
}
