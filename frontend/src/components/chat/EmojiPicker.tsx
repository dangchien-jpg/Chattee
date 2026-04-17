import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThemeStore } from "@/stores/useThemeStore";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="cursor-pointer">
            <Smile className="size-5" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="end"
          sideOffset={4}
          className="p-0 border-none shadow-lg"
        >
          <div className="">
            <Picker
              theme={isDark ? "dark" : "light"}
              data={data}
              onEmojiSelect={(emoji: any) => onChange(emoji.native)}
              emojiSize={20}
              previewPosition="none"
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer">
          <Smile className="size-5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={4}
        className="p-0 border-none shadow-lg mr-12"
      >
        <div className="">
          <Picker
            theme={isDark ? "dark" : "light"}
            data={data}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
            emojiSize={20}
            previewPosition="none"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
