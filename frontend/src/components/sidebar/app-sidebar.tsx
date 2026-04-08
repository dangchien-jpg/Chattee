// import { NavUser } from "@/components/sidebar/nav-user";
import AddFriendModal from "@/components/chat/AddFriendModal";
import CreateNewChat from "@/components/chat/CreateNewChat";
import DirectMessageList from "@/components/chat/DirectMessageList";
import GroupChatList from "@/components/chat/GroupChatList";
import NewGroupChatModal from "@/components/chat/NewGroupChatModal";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent className="beautiful-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="uppercase">
              Nhóm chat
            </SidebarGroupLabel>
            <NewGroupChatModal />
          </div>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Bạn bè</SidebarGroupLabel>
          <SidebarGroupAction title="Kết bạn" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
