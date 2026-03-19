import ChatWelcomeScreen from "@/components/chat/ChatWelcomeScreen";
import MessageItem from "@/components/chat/MessageItem";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "Đã gửi " | "Đã xem"
  >("Đã gửi ");

  // ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const key = `chat-scroll-${activeConversationId}`;

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const selectedConversation = conversations.find(
    (c) => c._id === activeConversationId,
  );

  useEffect(() => {
    const lastMessage = selectedConversation?.lastMessage;
    if (!lastMessage) return;

    const seenBy = selectedConversation?.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? "Đã xem" : "Đã gửi ");
  }, [selectedConversation]);

  useLayoutEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });

  const fetchMoreMessage = async () => {
    if (!activeConversationId) return;
    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) return null;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length]);

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
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
      >
        <div ref={messagesEndRef}></div>
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessage}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p>dang tai ...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
              key={message._id ?? index}
              index={index}
              message={message}
              messages={reversedMessages}
              selectedConversation={selectedConversation}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;
