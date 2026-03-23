import SearchForm from "@/components/addFriendModal/SearchForm";
import SendFriendRequestForm from "@/components/addFriendModal/SendFriendRequestForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFriendStore } from "@/stores/useFriendStore";
import type { User } from "@/types/user";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface IFormValue {
  userName: string;
  message: string;
}
const AddFriendModal = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValue>({
    defaultValues: { userName: "", message: "" },
  });

  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User | null>(null);
  const [searchedUserName, setSearchedUserName] = useState("");
  const { loading, searchByUserName, addFriend } = useFriendStore();

  const userNameValue = watch("userName");

  const handleSearch = handleSubmit(async (data) => {
    const userName = data.userName.trim();
    if (!userName) return;

    setIsFound(null);
    setSearchedUserName(userName);

    try {
      const foundUser = await searchByUserName(userName);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error(error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      const message = await addFriend(searchUser._id, data.message.trim());
      toast.success(message);
      handleCancel();
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUserName("");
    setIsFound(null);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10">
          <UserPlus className="size-4" />
          <span className="sr-only">Kết bạn</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogTitle>Kết bạn</DialogTitle>
        {!isFound && (
          <>
            <SearchForm
              register={register}
              errors={errors}
              userNameValue={userNameValue}
              loading={loading}
              isFound={isFound}
              searchedUserName={searchedUserName}
              onSubmit={handleSearch}
              onCancel={handleCancel}
            />
          </>
        )}

        {isFound && (
          <>
            <SendFriendRequestForm
              register={register}
              loading={loading}
              searchedUserName={searchedUserName}
              onSubmit={handleSend}
              onBack={() => setIsFound(null)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
