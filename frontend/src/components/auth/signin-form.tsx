import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";

const signInSchema = z.object({
  userName: z.string().min(1, "Tên đăng nhập không thể trống"),
  password: z.string().min(1, "Mật khẩu không thể trống"),
});
type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });
  const onSubmit = async (data: SignInFormValues) => {
    try {
      const { userName, password } = data;
      await signIn(userName, password);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        toast.warning(
          "Tài khoản chưa được xác minh. Vui lòng kiểm tra email để hoàn tất đăng ký.",
        );
        navigate("/auth/verify-email");
        return;
      }

      toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" className="w-[100px]" />
                </a>

                <h1 className="text-xl font-bold">
                  Chào mừng bạn quay trở lại
                </h1>
                <p className="text-muted-foreground text-balance">
                  Đăng nhập để bắt đầu!
                </p>
              </div>
              {/* userName */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="userName" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input type="text" id="userName" {...register("userName")} />
                {errors.userName && (
                  <p className="text-destructive text-sm">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className="relative flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
                <div className="absolute right-3 top-1/2 translate-y-1/2 ">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end ">
                <span
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                  className="text-sm underline text-muted-foreground cursor-pointer"
                >
                  Quên mật khẩu
                </span>
              </div>

              {/* button */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Mới vào Chattee?
                <a href="/signup" className="underline underline-offset-4">
                  Tạo tài khoản
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/Signin-amico.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
