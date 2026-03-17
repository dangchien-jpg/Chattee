import ChartCard from "@/components/chat/ChartCard";
import StatusBadge from "@/components/chat/StatusBadge";
import UnreadCountBadge from "@/components/chat/UnreadCountBadge";
import UserAvatar from "@/components/chat/UserAvatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useSocketStore } from "@/stores/useSocketStore";
import type { Conversation } from "@/types/chat";

const DirectMessageCard = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const otherUser = conversation.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCounts = conversation.unreadCounts[user._id];
  const lastMessage = conversation.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };
  return (
    <ChartCard
      conversationId={conversation._id}
      name={otherUser.displayName ?? ""}
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
          <UserAvatar
            type="sidebar"
            name={otherUser.displayName ?? ""}
            avatarUrl={otherUser.avatarUrl ?? undefined}
          />
          <StatusBadge
            status={
              onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"
            }
          />

          {unreadCounts > 0 && <UnreadCountBadge unreadCounts={unreadCounts} />}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-sm truncate",
            unreadCounts > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      }
    />
  );
};

export default DirectMessageCard;
