import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatOnlineTime, cn } from "@/lib/utils";
import { LogOut, MoreHorizontal } from "lucide-react";

interface ChatCardProps {
  conversationId: string;
  name: string;
  timestamp?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCounts?: number;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
  type: "group" | "direct";
  onLeave: (conversationId: string) => Promise<void>;
}
const ChatCard = ({
  conversationId,
  name,
  timestamp,
  isActive,
  onSelect,
  unreadCounts,
  leftSection,
  subtitle,
  type,
  onLeave,
}: ChatCardProps) => {
  return (
    <Card
      key={conversationId}
      className={cn(
        "border-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30 mt-2",
        isActive &&
          "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-primary-foreground",
      )}
      onClick={() => onSelect(conversationId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={cn(
                "font-semibold text-sm truncate",
                unreadCounts && unreadCounts > 0 && "text-foreground",
              )}
            >
              {name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {timestamp ? formatOnlineTime(timestamp) : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {subtitle}
            </div>
            {type === "group" && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal
                      className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 
                          hover:size-5 transition-smooth"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-40 border-none rounded-sm"
                    align="start"
                  >
                    <DropdownMenuGroup className="flex items-center justify-center gap-3">
                      <LogOut className="size-4 text-destructive" />
                      <DropdownMenuItem
                        className="text-destructive  focus:text-destructive"
                        onClick={() => onLeave(conversationId)}
                      >
                        Rời nhóm
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
