import { Card } from "@/components/ui/card";

const DisablePage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6  md:p-10">
      <Card className=" flex items-center m-auto p-6  max-w-[500px]">
        <span className="text-lg font-bold error-message">
          Tài khoản của bạn đã bị vô hiệu hóa
        </span>
        <a href="/signin" className="underline">
          Quay lại trang đăng nhập
        </a>
      </Card>
    </div>
  );
};

export default DisablePage;
