import type { IFormValue } from "@/components/chat/AddFriendModal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

interface SendRequestProps {
  register: UseFormRegister<IFormValue>;
  loading: boolean;
  searchedUserName: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  searchedUserName,
  onSubmit,
  onBack,
}: SendRequestProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="success-message">
          Tìm thấy <span className="font-semibold">@{searchedUserName}</span>
        </span>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-semibold">
            Giới thiệu
          </Label>
          <Textarea
            id="message"
            rows={3}
            placeholder="Chào bạn! Có thể kết bạn với tui được không?"
            className="glass mb-4 border-border/50 focus:border-primary/50 transition-smooth resize-none"
            {...register("message")}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant={"outline"}
            className="flex-1 glass hover:text-destructive cursor-pointer"
            onClick={onBack}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-chat hover:opacity-90 text-white cursor-pointer mb-2 md:mb-0"
          >
            {loading ? (
              <span>Đang gửi</span>
            ) : (
              <>
                <UserPlus className="size-4" /> Gửi lời mời{" "}
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export default SendFriendRequestForm;
