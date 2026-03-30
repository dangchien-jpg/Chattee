import ChatCard from "@/components/chat/ChatCard";
import GroupChatAvatar from "@/components/chat/GroupChatAvatar";
import UnreadCountBadge from "@/components/chat/UnreadCountBadge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { toast } from "sonner";

const GroupCardChat = ({ conversation }: { conversation: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
    leaveGroup,
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

  const handleLeaveGroup = async (conversationId: string) => {
    try {
      await leaveGroup(conversationId);
      toast.success("Bạn đã rời khỏi nhóm này");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChatCard
      conversationId={conversation._id}
      name={name}
      onLeave={() => handleLeaveGroup(conversation._id)}
      type="group"
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
