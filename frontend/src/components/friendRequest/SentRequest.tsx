import FriendRequestItem from "@/components/friendRequest/FriendRequestItem";
import { useFriendStore } from "@/stores/useFriendStore";

const SentRequest = () => {
  const { sentList } = useFriendStore();
  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {sentList.map((item) => (
        <FriendRequestItem
          key={item._id}
          type="sent"
          requestInfo={item}
          actions={
            <p className="text-sm text-muted-foreground">Đang chờ trả lời</p>
          }
        />
      ))}
    </div>
  );
};

export default SentRequest;
