import { MessageCircle } from "lucide-react";

const CreateNewChat = () => {
  return (
    <div className="flex flex-col items-start  gap-2 bg-primary-foreground p-2">
      <div className="bg-gradient-chat p-4 rounded-full ">
        <MessageCircle className="size-4 text-white" />
      </div>
    </div>
  );
};

export default CreateNewChat;
