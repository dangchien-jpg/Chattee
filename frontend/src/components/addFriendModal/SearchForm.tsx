import type { IFormValue } from "@/components/chat/AddFriendModal";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface SearchFormProps {
  register: UseFormRegister<IFormValue>;
  errors: FieldErrors<IFormValue>;
  loading: boolean;
  userNameValue: string;
  isFound: boolean | null;
  searchedUserName: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  loading,
  userNameValue,
  isFound,
  searchedUserName,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className=" space-y-2">
        <Label htmlFor="userName" className="text-sm font-semibold">
          Tìm bằng tên người dùng
        </Label>
        <Input
          id="userName"
          placeholder="Gõ tên người dùng vào đây..."
          className="glass border-border/50 focus:border-primary/50 transition-smooth"
          {...register("userName", {
            required: "Tên người dùng không được trống",
          })}
        />
        {errors.userName && (
          <p className="error-message">{errors.userName.message}</p>
        )}

        {isFound === false && (
          <>
            <span className="error-message">
              Không tìm thấy người dùng
              <span className="font-semibold"> @{searchedUserName}</span>
            </span>
          </>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant={"outline"}
            className="flex-1 glass hover:text-destructive hover:bg-none cursor-pointer"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !userNameValue?.trim()}
          className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth cursor-pointer"
        >
          {loading ? (
            <span>Đang tìm...</span>
          ) : (
            <>
              <Search className="size-4" /> Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
