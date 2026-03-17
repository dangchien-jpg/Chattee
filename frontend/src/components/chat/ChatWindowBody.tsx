import ChatWelcomeScreen from "@/components/chat/ChatWelcomeScreen";
import MessageItem from "@/components/chat/MessageItem";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useState } from "react";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedConversation = conversations.find(
    (c) => c._id === activeConversationId,
  );

  useEffect(() => {
    const lastMessage = selectedConversation?.lastMessage;
    if (!lastMessage) return;

    const seenBy = selectedConversation?.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  }, [selectedConversation]);

  if (!selectedConversation) {
    return <ChatWelcomeScreen />;
  }

  if (!messages.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này
      </div>
    );
  }
  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            index={index}
            message={message}
            messages={messages}
            selectedConversation={selectedConversation}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
