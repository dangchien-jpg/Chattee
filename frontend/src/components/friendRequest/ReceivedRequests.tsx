import FriendRequestItem from "@/components/friendRequest/FriendRequestItem";
import { Button } from "@/components/ui/button";
import { useFriendStore } from "@/stores/useFriendStore";
import { toast } from "sonner";

const ReceivedRequests = () => {
  const { acceptRequest, declineRequest, loading, receivedList } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Chưa có lời mời kết bạn nào.
      </p>
    );
  }

  const handleAccept = async (id: string) => {
    try {
      await acceptRequest(id);
      toast.success("Chấp nhận lời mời thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi chấp nhận lời mời");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineRequest(id);
      toast.success("Bạn đã từ chối kết bạn với người này");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi từ chối lời mời");
    }
  };

  return (
    <div className="space-y-3">
      {receivedList.map((item) => (
        <FriendRequestItem
          type="received"
          requestInfo={item}
          key={item._id}
          actions={
            <div className="flex gap-3">
              <Button
                variant={"completeGhost"}
                className="flex-1 glass cursor-pointer text-destructive"
                onClick={() => handleDecline(item._id)}
                disabled={loading}
              >
                Từ chối
              </Button>
              <Button
                className="flex-1 glass cursor-pointer bg-blue-500 hover:bg-blue-400 "
                onClick={() => handleAccept(item._id)}
                disabled={loading}
              >
                Chấp nhận
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
