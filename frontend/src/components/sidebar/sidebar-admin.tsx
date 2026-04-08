import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Users } from "lucide-react";

export function SidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  return (
    <Sidebar className=" rounded-sm shadow-md" variant="inset" {...props}>
      <SidebarContent className="beautiful-scrollbar">
        <SidebarGroup>
          <div className="flex items-center gap-2 hover:bg-slate-100 py-3 rounded-md cursor-pointer">
            <Users className="size-4" />
            <span className="text-sm font-semibold ">Người dùng</span>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
