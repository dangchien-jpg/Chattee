import { SignInForm } from "@/components/auth/signin-form";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const SignInPage = () => {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || !user) return;
    if (!user.isVerified) {
      toast.warning(
        "Tài khoản chưa xác minh, hãy vào email của bạn để xác minh!",
      );
      return;
    }
    if (user.status === "banned") {
      navigate("/disable", { replace: true });
      return;
    }
    if (user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [accessToken, user]);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6  md:p-10 bg-gradient-purple">
      <div className="w-full md:max-w-3xl ">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;
