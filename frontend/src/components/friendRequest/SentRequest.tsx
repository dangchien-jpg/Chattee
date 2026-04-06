import FriendRequestItem from "@/components/friendRequest/FriendRequestItem";
import { Button } from "@/components/ui/button";
import { useFriendStore } from "@/stores/useFriendStore";
import { toast } from "sonner";

const SentRequest = () => {
  const { sentList, cancelSentFriendRequest } = useFriendStore();
  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào.
      </p>
    );
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelSentFriendRequest(id);
      toast.success("Đã hủy yêu cầu kết bạn");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi hủy yêu cầu kết bạn");
    }
  };
  return (
    <div className="space-y-3">
      {sentList.map((item) => (
        <FriendRequestItem
          key={item._id}
          type="sent"
          requestInfo={item}
          actions={
            <Button
              variant={"completeGhost"}
              onClick={() => handleCancel(item._id)}
              className="text-sm text-destructive"
            >
              Hủy yêu cầu
            </Button>
          }
        />
      ))}
    </div>
  );
};

export default SentRequest;
