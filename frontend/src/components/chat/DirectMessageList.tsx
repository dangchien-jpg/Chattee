import DirectMessageCard from "@/components/chat/DirectMessageCard";
import { useChatStore } from "@/stores/useChatStore";

const DirectMessageList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;

  const directConversations = conversations.filter(
    (conversation) =>
      conversation.type === "direct" && conversation.lastMessage !== null,
  );

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {directConversations.map((conversation) => (
        <DirectMessageCard key={conversation._id} conversation={conversation} />
      ))}
    </div>
  );
};

export default DirectMessageList;
