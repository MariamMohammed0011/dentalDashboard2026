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
      // جلب الـ refreshToken المخزن (يفضل تخزينه عند تسجيل الدخول)
      const refreshToken = Cookies.get("refresh_token"); 

      const formData = new FormData();
      if (refreshToken) {
        formData.append("refreshToken", refreshToken); // كما يظهر في image_2b4290.png
      }

      // إرسال الطلب للسيرفر
      return await axiosInstance.post("/auth/logout", formData);
    },
    onSuccess: () => {
      // 1. حذف التوكنات من الكوكيز
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");

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
      Cookies.remove("auth_token");
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