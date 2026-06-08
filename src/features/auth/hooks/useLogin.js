
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import axiosInstance from "../../../api/axios";

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (credentials) => {
      const formData = new FormData();
      formData.append("email", credentials.username);
      formData.append("password", credentials.password);
      
      const response = await axiosInstance.post("/auth/login", formData);
      return response.data;
    },

    onSuccess: (data) => {
  // للبيئة المحلية، نكتفي بوضع الإعدادات القياسية لضمان قراءتها من نفس المتصفح دون حجب حماية
  const isLocalhost = window.location.hostname === "localhost";
  const cookieConfig = isLocalhost 
    ? { expires: 7 } // إعدادات محلية مرنة لتفادي انهيار الـ CORS
    : { expires: 7, secure: true, sameSite: "none" }; // الإنتاج

  const refreshConfig = isLocalhost 
    ? { expires: 30 } 
    : { expires: 30, secure: true, sameSite: "none" };

  // 1. تعيين الأكسس توكن في الكوكيز
  Cookies.set("auth_token", data.accessToken, cookieConfig);

  // 2. تعيين الريفرش توكن في الكوكيز
  Cookies.set("refresh_token", data.refreshToken, refreshConfig);

  // 3. تخزين الـ userId والـ role داخل الكوكيز
  Cookies.set("user_id", data.userId, cookieConfig);
  Cookies.set("user_role", data.role, cookieConfig);

  toast.success("تم تسجيل الدخول بنجاح");
  setTimeout(() => navigate("/dashboard"), 500);
},
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "حدث خطأ غير متوقع";
      toast.error(errorMessage);
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    if (!payload.username || !payload.password) {
      toast.warning("يرجى إدخال جميع البيانات");
      return;
    }

    mutate(payload);
  };

  return { handleLogin, isPending };
};
