import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { CheckCircle2, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const VerifyMailPage = () => {
  const [params] = useSearchParams();
  const { verifyEmail, resendEmail } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );

  const [message, setMessage] = useState("");

  const [coolDown, setCoolDown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const calledRef = useRef(false);

  // ================= VERIFY =================
  useEffect(() => {
    if (!token || calledRef.current) return;

    calledRef.current = true;

    verifyEmail(token)
      .then((res: any) => {
        const code = res.code;

        if (code === "VERIFY_SUCCESS" || code === "ALREADY_VERIFIED") {
          setStatus("success");
          setMessage("Email của bạn đã được xác minh");
        } else {
          setStatus("error");
          setMessage("Có lỗi xảy ra");
        }
      })
      .catch((err: unknown) => {
        if (err instanceof AxiosError) {
          const code = err.response?.data?.code;
          if (code === "INVALID_OR_USED") {
            setStatus("error");
            setMessage("Mã xác minh không hợp lệ hoặc đã được sử dụng");
            return;
          }

          if (code === "TOKEN_EXPIRED") {
            setMessage("Mã xác minh đã hết hạn");
          } else {
            setMessage("Lỗi hệ thống, vui lòng thử lại");
          }
        } else {
          setMessage("Lỗi không xác định");
        }

        setStatus("error");
      });
  }, [token]);

  // ================= Resend Email =================
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

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canResend) return;

    try {
      await resendEmail(email);
      toast.success("Vui lòng kiểm email để xác minh");
      startCoolDown();
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi lại email");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6  bg-slate-200">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>

          <h2 className="text-2xl font-semibold mb-2">Xác minh email</h2>

          <p className="text-gray-600 mb-6">
            Vui lòng kiểm tra email để xác minh tài khoản
          </p>
          <form onSubmit={handleResend} className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              required
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!canResend}
              className={`w-full py-2 border cursor-pointer hover:bg-slate-200 border-primary rounded-sm text-primary bg-white${
                canResend ? "border border-primary" : "bg-gray-400"
              }`}
            >
              {canResend ? "Gửi lại mã xác minh" : `Gửi lại sau ${coolDown}s`}
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-200">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          {status === "loading" && (
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          )}

          {status === "success" && (
            <div className="text-green-500 flex justify-center">
              <CheckCircle2 className="size-12" />
            </div>
          )}

          {status === "error" && (
            <div className="text-red-500 text-5xl flex justify-center">
              <CircleX className="size-12" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          {status === "loading" && "Đang xác minh..."}
          {status === "success" && (
            <span className="text-2xl success-message">Thành công</span>
          )}
          {status === "error" && (
            <span className="text-2xl error-message">Thất bại</span>
          )}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>
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
    </div>
  );
};

export default VerifyMailPage;
