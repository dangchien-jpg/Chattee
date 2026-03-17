import GroupCardChat from "@/components/chat/GroupCardChat";
import { useChatStore } from "@/stores/useChatStore";

const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

  const groupChats = conversations.filter(
    (conversation) => conversation.type === "group",
  );
  return (
    <div>
      {groupChats.map((conversation) => (
        <GroupCardChat key={conversation._id} conversation={conversation} />
      ))}
    </div>
  );
};

export default GroupChatList;
