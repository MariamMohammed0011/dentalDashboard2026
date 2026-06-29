import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../../../api/axios";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
       const refreshToken = Cookies.get("refresh_token"); 

      const formData = new FormData();
      if (refreshToken) {
        formData.append("refreshToken", refreshToken); // كما يظهر في image_2b4290.png
      }

      // إرسال الطلب للسيرفر
      return await axiosInstance.post("/auth/logout", formData);
    },
    onSuccess: () => {
      // 1. حذف التوكنات والمعلومات من الكوكيز بشكل آمن
      Cookies.remove("auth_token", { secure: true, sameSite: "none" });
      Cookies.remove("refresh_token", { secure: true, sameSite: "none" });
      Cookies.remove("user_id", { secure: true, sameSite: "none" });
      Cookies.remove("user_role", { secure: true, sameSite: "none" });

      // 2. تنظيف بيانات المستخدم من localStorage
      localStorage.removeItem("user_info");

      // 3. مسح كاش TanStack Query لضمان عدم بقاء بيانات قديمة
      queryClient.clear();

      toast.success("تم تسجيل الخروج بنجاح");
      
      // 4. التوجه لصفحة تسجيل الدخول
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      // حتى لو فشل الطلب في السيرفر، يفضل تنظيف المتصفح محلياً
      Cookies.remove("auth_token", { secure: true, sameSite: "none" });
      Cookies.remove("refresh_token", { secure: true, sameSite: "none" });
      Cookies.remove("user_id", { secure: true, sameSite: "none" });
      Cookies.remove("user_role", { secure: true, sameSite: "none" });
      localStorage.removeItem("user_info");
      navigate("/login");
      console.error("Logout Error:", error);
    }
  });

  return {
    handleLogout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending
  };
};