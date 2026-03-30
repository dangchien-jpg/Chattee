import FriendListModal from "@/components/chat/FriendListModal";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useFriendStore } from "@/stores/useFriendStore";
import { MessageCircleMore } from "lucide-react";
import { useState } from "react";

const CreateNewChat = () => {
  const { getAllFriends } = useFriendStore();
  const [open, setOpen] = useState<boolean>(false);

  const handleGetAllFriends = async () => {
    await getAllFriends();
    setOpen(true);
  };

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <Card
            onClick={handleGetAllFriends}
            className=" flex-1 p-3 glass hover:shadow-soft transition-smooth cursor-pointer group/card "
          >
            <div className="flex items-center gap-4 max-w-full">
              <div className="flex size-8 bg-gradient-chat rounded-full items-center justify-center group-hover/card:scale-110">
                <MessageCircleMore className="size-4 text-white" />
              </div>
              <span className="text-sm font-medium capitalize">
                Tạo cuộc trò chuyện mới
              </span>
            </div>
          </Card>
        </DialogTrigger>

        <FriendListModal setOpen={setOpen} />
      </Dialog>
    </div>
  );
};

export default CreateNewChat;
