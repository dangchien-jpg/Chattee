import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full md:p-4">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
}
