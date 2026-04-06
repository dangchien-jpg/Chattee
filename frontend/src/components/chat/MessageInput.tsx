import EmojiPicker from "@/components/chat/EmojiPicker";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { ImagePlus, Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useFriendStore } from "@/stores/useFriendStore";
import { apiCloud } from "@/lib/uploads";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const MessageInput = ({
  selectedConversation,
}: {
  selectedConversation: Conversation;
}) => {
  const { user } = useAuthStore();
  const [value, setValue] = useState("");
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const { friends = [] } = useFriendStore();
  const { activeConversationId, conversations } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (!user) return;

  const activeConversation = conversations.find(
    (c) => c._id.toString() === activeConversationId?.toString(),
  );

  const otherUser = activeConversation?.participants.find(
    (p) => p._id.toString() !== user?._id.toString(),
  )?._id;

  const isFriend = friends.some(
    (f) => f._id.toString() === otherUser?.toString(),
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const MAX_SIZE = 10 * 1024 * 1024;
    if (!selectedFile) return;

    if (selectedFile.size > MAX_SIZE) {
      toast.error("Ảnh vượt quá 10MB, vui lòng chọn ảnh nhỏ hơn!");
      return;
    }

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat_upload");

    const res = await apiCloud.post(`/${CLOUD_NAME}/image/upload`, formData);

    const data = res.data;
    return data.secure_url as string;
  };

  const sendMessage = async () => {
    if (!value.trim() && !file) return;
    const currentValue = value;
    setValue("");
    try {
      let imgUrl: string | undefined;
      if (file) {
        const imageCompression = await compressImage(file);
        imgUrl = await uploadImage(imageCompression);
      }

      if (selectedConversation.type === "direct") {
        const participants = selectedConversation.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(
          otherUser._id,
          currentValue,
          selectedConversation._id,
          imgUrl,
        );
      } else {
        await sendGroupMessage(selectedConversation._id, currentValue, imgUrl);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    } finally {
      setValue("");
      setFile(null);
      setPreview(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isFriend) {
    return (
      <Input
        disabled
        className="border-none text-center"
        placeholder="Bạn chưa kết bạn với người này.Hãy kết bạn để tiếp tục trò chuyện."
      />
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 m-h-[56px] bg-background ">
      <Button
        onClick={handleClick}
        variant={"ghost"}
        size="icon"
        className="hover:bg-primary/10 transition-smooth cursor-pointer"
      >
        <ImagePlus className="size-4" />
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleSelectedFile}
        />
      </Button>

      <div className="flex-1 border border-input shadow-sm focus-within:border-primary/50 rounded px-2 py-1 flex-row items-center gap-6 bg-white">
        {/* preview ảnh */}
        {preview && (
          <div className="relative w-10 h-10 shrink-0 mt-2 mb-4">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover rounded"
            />
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="absolute -top-1 -right-3 bg-slate-100 ring ring-slate-300 text-black rounded-full text-xs px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* input */}
        <div className="flex">
          <input
            value={value}
            onKeyDown={handleKeyPress}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Soạn tin nhắn..."
            className="flex-1 outline-none bg-transparent text-sm"
          />

          {/* emoji */}
          <div className="flex items-center">
            <EmojiPicker
              onChange={(emoji: string) => setValue(value + emoji)}
            />
          </div>
        </div>
      </div>

      <Button
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105 cursor-pointer"
        disabled={!value.trim() && !file}
        onClick={sendMessage}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessageInput;
