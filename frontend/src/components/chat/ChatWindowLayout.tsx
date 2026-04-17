import ChatWelcomeScreen from "@/components/chat/ChatWelcomeScreen";
import ChatWindowBody from "@/components/chat/ChatWindowBody";
import ChatWindowHeader from "@/components/chat/ChatWindowHeader";
import ChatWindowSkeleton from "@/components/chat/ChatWindowSkeleton";
import MessageInput from "@/components/chat/MessageInput";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const ChatWindowLayout = () => {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  const {
    activeConversationId,
    conversations,
    messageLoading: loading,
    markAsSeen,
  } = useChatStore();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(true);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const selectedConversation =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!selectedConversation) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error(error);
      }
    };

    markSeen();
  }, [markAsSeen, selectedConversation]);

  if (!selectedConversation) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      <ChatWindowHeader chat={selectedConversation} />

      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>

      <MessageInput selectedConversation={selectedConversation} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
