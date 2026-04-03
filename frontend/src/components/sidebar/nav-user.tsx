"use client";

import { Bell, ChevronsUpDown, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/types/user";
import Logout from "@/components/auth/Logout";
import { useState } from "react";
import FriendRequestDialog from "@/components/friendRequest/FriendRequestDialog";
import ProfileDialog from "@/components/profile/ProfileDialog";
import { useFriendStore } from "@/stores/useFriendStore";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const [friendRequestOpen, setFriendRequestOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationCount = useFriendStore((n) => n.notificationCount);
  const { resetNotificationCount } = useFriendStore();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full">
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                    <AvatarFallback className="rounded-lg">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.displayName}
                    </span>
                    <span className="truncate text-xs">@{user.userName}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user.displayName}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.displayName}
                      </span>
                      <span className="truncate text-xs">{user.userName}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                    <UserIcon className="size-6 text-muted-foreground dark:group-focus:!text-accent-foreground" />
                    Tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setFriendRequestOpen(true);
                      resetNotificationCount();
                    }}
                  >
                    <Bell className="text-muted-foreground dark:group-focus:!text-accent-foreground" />
                    Thông báo
                    {notificationCount > 0 && (
                      <div className="absolute z-20 -top-1 left-4 rounded-full bg-gradient-chat px-1 ring ring-white">
                        <span className="flex items-center text-[10px] text-white ">
                          {notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                      </div>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <FriendRequestDialog
        open={friendRequestOpen}
        setOpen={setFriendRequestOpen}
      />

      <ProfileDialog open={profileOpen} setOpen={setProfileOpen} />
    </>
  );
}
