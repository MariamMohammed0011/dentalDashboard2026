import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import axiosInstance from "../../../api/axios";

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    
    mutationFn: async ({ credentials, rememberMe }) => {
      const formData = new FormData();
      formData.append("email", credentials.username);
      formData.append("password", credentials.password);
      
      const response = await axiosInstance.post("/auth/login", formData);
      
      
      return { ...response.data, rememberMe };
    },

    onSuccess: (data) => {
  const isLocalhost = window.location.hostname === "localhost";

  const tokenExpiry = data.rememberMe ? 7 : undefined;
  const refreshExpiry = data.rememberMe ? 30 : undefined;

  const cookieConfig = isLocalhost 
    ? (tokenExpiry ? { expires: tokenExpiry } : {}) // إعدادات محلية مرنة لتفادي انهيار الـ CORS
    : { expires: tokenExpiry, secure: true, sameSite: "none" }; // الإنتاج

  const refreshConfig = isLocalhost 
    ? (refreshExpiry ? { expires: refreshExpiry } : {}) 
    : { expires: refreshExpiry, secure: true, sameSite: "none" };

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
    
    // فحص حالة checkbox "تذكر حسابي" من الفورم
    const rememberMe = formData.has("rememberMe");
    const payload = Object.fromEntries(formData);

    if (!payload.username || !payload.password) {
      toast.warning("يرجى إدخال جميع البيانات");
      return;
    }

    // تمرير الـ payload مع حالة الـ rememberMe إلى الـ mutate
    mutate({ credentials: payload, rememberMe });
  };

  return { handleLogin, isPending };
};