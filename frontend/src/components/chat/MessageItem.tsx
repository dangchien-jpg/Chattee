import UserAvatar from "@/components/chat/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConversation: Conversation;
  lastMessageStatus: "Đã gửi " | "Đã xem";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConversation,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const timeDiff = Math.abs(
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime(),
  );

  const isShowTime = !prev || timeDiff > 300000;

  const isGroupBreak =
    !prev || message.senderId !== prev?.senderId || timeDiff > 300000;

  const participant = selectedConversation.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  return (
    <>
      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Chattee"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col ",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          {message.content && (
            <Card
              className={cn(
                "p-3",
                message.isOwn
                  ? "bg-gradient-chat text-white"
                  : "bg-chat-bubble-received",
              )}
            >
              <p className="text-sm leading-relaxed break-words">
                {message.content}
              </p>
            </Card>
          )}

          {message.imgUrl && (
            <img
              src={message.imgUrl}
              alt="image"
              className="rounded-xl max-w-full max-h-60 object-cover"
            />
          )}

          {message.isOwn &&
            message._id === selectedConversation.lastMessage?._id && (
              <Badge
                variant={"outline"}
                className={cn(
                  "text-xs px-1.5 py-0.5 h-4 border-0",
                  lastMessageStatus === "Đã xem"
                    ? " text-primary"
                    : " text-muted-foreground",
                )}
              >
                {lastMessageStatus}
              </Badge>
            )}
        </div>
      </div>
      {isShowTime && (
        <span className="text-xs text-center text-muted-foreground px-1">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}
    </>
  );
};

export default MessageItem;
