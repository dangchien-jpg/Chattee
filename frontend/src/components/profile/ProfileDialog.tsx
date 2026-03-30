import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import PreferencesForm from "@/components/profile/PreferencesForm";
import PrivacySettings from "@/components/profile/PrivacySettings";
import ProfileCard from "@/components/profile/ProfileCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 bg-transparent border-0 shadow-2xl scrollbar-none">
        <div className="bg-gradient-glass">
          <div className="max-w-4xl mx-auto p-4">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-foreground">
                Tài khoản & Cấu hình
              </DialogTitle>
            </DialogHeader>

            <ProfileCard user={user} />

            <Tabs defaultValue="personal" className="my-4">
              <TabsList className="grid w-full grid-cols-3 glass-light">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:glass-strong"
                >
                  Tài Khoản
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="data-[state=active]:glass-strong"
                >
                  Cấu Hình
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="data-[state=active]:glass-strong"
                >
                  Bảo Mật
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalInfoForm userInfo={user} />
              </TabsContent>

              <TabsContent value="preferences">
                <PreferencesForm />
              </TabsContent>

              <TabsContent value="privacy">
                <PrivacySettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
