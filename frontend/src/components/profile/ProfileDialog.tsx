import ProfileCard from "@/components/profile/ProfileCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { type Dispatch, type SetStateAction } from "react";

interface ProfileDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {
  const { user } = useAuthStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto p-0 bg-transparent border-0 shadow-2xl">
        <div className="bg-gradient-glass">
          <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-foreground">
                Tài khoản & Cấu hình
              </h1>
            </div>

            <ProfileCard user={user} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
