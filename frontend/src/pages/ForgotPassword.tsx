import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [messagePassword, setMessagePassword] = useState("");
  const [messageConfirmPassword, setMessageConfirmPassword] = useState("");
  const [coolDown, setCoolDown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const navigate = useNavigate();

  const { forgotPassword, resendOTP, resetPassword } = useAuthStore();

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep("reset");
      startCoolDown();
      toast.success("Mã OTP đã được gửi đến. Vui lòng kiểm tra email của bạn");
    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi mã OTP. Vui lòng thử lại.");
    }
  };

  const resendOtpEmail = async () => {
    try {
      await resendOTP(email);
      startCoolDown();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi gửi lại OTP");
    }
  };

  const updatePassword = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Mã OTP phải gồm 6 chữ số");
      return;
    }
    if (password.trim().length < 6) {
      setErrorPassword(true);
      setMessagePassword("Mật khẩu phải tối thiểu 6 ký tự");
      return;
    }
    if (password !== confirm) {
      setErrorConfirmPassword(true);
      setMessageConfirmPassword("Mật khẩu không khớp");
      return;
    }
    try {
      await resetPassword(email, password, otp);
      toast.success("Thay đổi mật khẩu thành công");
      navigate("/signin");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const code = error.response?.data?.code;
        if (code === "INVALID_OTP") {
          toast.error("Mã OTP không đúng");
          return;
        }
        if (code === "OTP_EXPIRED") {
          toast.error("Mã OTP hết hạn");
          return;
        }
      } else {
        toast.error("Lỗi khi xác minh OTP");
      }
    }
  };

  const startCoolDown = () => {
    setCanResend(false);
    setCoolDown(30);

    const interval = setInterval(() => {
      setCoolDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          {step === "email" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {step === "email"
            ? "Nhập email để nhận mã xác minh"
            : `Nhập mã OTP đã gửi đến ${email}`}
        </p>

        {/* ================= STEP 1 ================= */}
        {step === "email" && (
          <form onSubmit={sendOTP} className="flex flex-col gap-4">
            <Input
              required
              type="email"
              placeholder="Nhập email"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              variant="completeGhost"
              className=" bg-gradient-chat text-white py-2 rounded-lg  transition"
            >
              Gửi mã OTP
            </Button>
            <Button
              variant="completeGhost"
              className="w-full"
              onClick={() => {
                navigate("/signin");
              }}
            >
              <span className="text-sm text-muted-foreground underline">
                Quay lại trang đăng nhập
              </span>
            </Button>
          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === "reset" && (
          <div className="flex flex-col gap-4">
            {/* OTP */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nhập mã OTP"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                variant="completeGhost"
                disabled={!canResend}
                onClick={resendOtpEmail}
                className={`text-sm ${
                  canResend ? "bg-gradient-chat  text-white" : "text-gray-400"
                }`}
              >
                {canResend ? "Gửi lại mã" : `Gửi lại sau ${coolDown}s`}
              </Button>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm text-muted-foreground"
              >
                Mật khẩu mới
              </Label>
              <Input
                id="password"
                type="password"
                onFocus={() => setErrorPassword(false)}
                placeholder="Mật khẩu mới"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword && (
                <span className="text-sm error-message">{messagePassword}</span>
              )}

              {/* Confirm */}
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-muted-foreground"
              >
                Nhập lại mật khẩu
              </Label>
              <Input
                id="confirmPassword"
                type="Password"
                onFocus={() => setErrorConfirmPassword(false)}
                placeholder="Nhập lại mật khẩu"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {errorConfirmPassword && (
                <span className="text-sm error-message">
                  {messageConfirmPassword}
                </span>
              )}
            </div>

            {/* Submit */}
            <Button
              variant="completeGhost"
              onClick={updatePassword}
              className="bg-gradient-chat  text-white py-2 rounded-lg  transition"
            >
              Đặt lại mật khẩu
            </Button>

            <Button
              variant="completeGhost"
              className="w-full"
              onClick={() => {
                navigate("/signin");
              }}
            >
              <span className="text-sm text-muted-foreground underline">
                Quay lại trang đăng nhập
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
