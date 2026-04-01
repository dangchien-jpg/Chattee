import UserAvatar from "@/components/chat/UserAvatar";
import { Card } from "@/components/ui/card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import { MessageCircleMore, MoreHorizontal, Users } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const FriendListModal = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { friends, loading } = useFriendStore();
  const { createConversation } = useChatStore();
  const { unFriend } = useFriendStore();

  if (loading) {
    <div>loading...</div>;
  }

  if (!friends || friends.length === 0) {
    return (
      <DialogContent className="text-center py-8 text-muted-foreground">
        <Users className="size-12 mx-auto mb-3 opacity-50" />
        Chưa có bạn bè. Kết bạn để trò chuyện nào!
      </DialogContent>
    );
  }

  const handleAddConversation = async (friendId: string) => {
    await createConversation("direct", "", [friendId]);
    setOpen(false);
  };

  const handleUnFriend = async (friendId: string) => {
    try {
      console.log(friendId);
      console.log(friends);
      await unFriend(friendId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogContent className="glass max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl capitalize">
          <MessageCircleMore className="size-5" />
          Bắt đầu hội thoại mới
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 ">
        <h1 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          danh sách bạn bè
        </h1>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {friends.map((friend) => (
            <Card
              key={friend._id}
              className="p-2 cursor-pointer transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard"
              onClick={() => handleAddConversation(friend._id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar
                    type="chat"
                    name={friend.displayName}
                    avatarUrl={friend.avatarUrl}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h2 className="font-semibold text-sm truncate">
                    {friend.displayName}
                  </h2>
                  <span>@{friend.userName}</span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreHorizontal className="size-4 text-muted-foreground " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-40 border-none rounded-sm"
                      align="start"
                    >
                      <DropdownMenuGroup className="flex items-center justify-start gap-3">
                        <DropdownMenuItem
                          className="text-destructive  focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnFriend(friend._id);
                          }}
                        >
                          Hủy kết bạn
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};

export default FriendListModal;
