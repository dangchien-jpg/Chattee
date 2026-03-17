import ChartCard from "@/components/chat/ChartCard";
import GroupChatAvatar from "@/components/chat/GroupChatAvatar";
import UnreadCountBadge from "@/components/chat/UnreadCountBadge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";

const GroupCardChat = ({ conversation }: { conversation: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return null;

  const unreadCounts = conversation.unreadCounts[user._id];
  const name = conversation.group?.name ?? "";
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };
  return (
    <ChartCard
      conversationId={conversation._id}
      name={name}
      timestamp={
        conversation.lastMessage?.createdAt
          ? new Date(conversation.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === conversation._id}
      onSelect={handleSelectConversation}
      unreadCounts={unreadCounts}
      leftSection={
        <>
          {unreadCounts > 0 && <UnreadCountBadge unreadCounts={unreadCounts} />}
          <GroupChatAvatar
            type="chat"
            participants={conversation.participants}
          />
        </>
      }
      subtitle={
        <p className="text-sm truncate text-muted-foreground">
          {conversation.participants.length} thành viên
        </p>
      }
    />
  );
};

export default GroupCardChat;
