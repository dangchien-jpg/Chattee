import InviteSuggestionList from "@/components/newGroupChat/InviteSuggestionList";
import SelectedUsersList from "@/components/newGroupChat/SelectedUsersList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import type { Friend } from "@/types/user";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends = [], getAllFriends } = useFriendStore();
  const [inviteUsers, setInviteUsers] = useState<Friend[]>([]);
  const { loading, createConversation } = useChatStore();

  const handleGetFriends = async () => {
    await getAllFriends();
  };

  const filterFriends = friends.filter(
    (friend) =>
      friend.displayName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) &&
      !inviteUsers.some((u) => u._id === friend._id),
  );

  const handleSelectFriend = (friend: Friend) => {
    setInviteUsers([...inviteUsers, friend]);
    setSearch("");
  };

  const handleRemove = (friend: Friend) => {
    setInviteUsers(inviteUsers.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (inviteUsers.length === 0) {
        toast.warning("Bạn phải mời ít nhất một thành viên vào nhóm");
        return;
      }

      await createConversation(
        "group",
        groupName,
        inviteUsers.map((u) => u._id),
      );

      setSearch("");
      setGroupName("");
      setInviteUsers([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          onClick={handleGetFriends}
          className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer"
        >
          <Users className="size-4" />
          <span className="sr-only">Tạo nhóm</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle className="capitalize">
            Tạo nhóm trò chuyện mới
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-semibold">
              Tên nhóm
            </Label>
            <Input
              id="groupName"
              placeholder="Gõ tên nhóm vào đây..."
              className="glass border-border/50 focus:border-primary/50 transition-smooth"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite" className="text-sm font-semibold">
              Mời thành viên
            </Label>
            <Input
              id="invite"
              placeholder="Tìm theo tên  hiển thị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && filterFriends.length > 0 && (
              <InviteSuggestionList
                filteredFriends={filterFriends}
                onSelect={handleSelectFriend}
              />
            )}

            <SelectedUsersList
              invitedUsers={inviteUsers}
              onRemove={handleRemove}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className=" flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth cursor-pointer"
              >
                {loading ? (
                  "Đang tạo..."
                ) : (
                  <>
                    <UserPlus className="size-4 mr-2" />
                    Tạo nhóm
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModal;
