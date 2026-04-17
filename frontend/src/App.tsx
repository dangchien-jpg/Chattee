import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ChatAppPage from "./pages/ChatAppPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocketStore } from "@/stores/useSocketStore";
import DashboardPage from "@/pages/DashboardPage";
import { AdminRoute } from "@/components/auth/AdminRoute";
import DisablePage from "@/pages/DisablePage";
import VerifyMailPage from "@/pages/VerifyMailPage";
import ForgotPassword from "@/pages/ForgotPassword";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/auth/verify-email" element={<VerifyMailPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* private routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
            <Route path="/disable" element={<DisablePage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
