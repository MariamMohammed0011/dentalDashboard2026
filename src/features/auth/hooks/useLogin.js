// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie"; // 1. استيراد المكتبة
// import axiosInstance from "../../../api/axios";

// export const useLogin = () => {
//   const navigate = useNavigate();

//   const { mutate, isPending } = useMutation({
//     mutationFn: async (credentials) => {
//       // الكود السابق لإرسال البيانات كـ FormData
//       const formData = new FormData();
//       formData.append("email", credentials.username);
//       formData.append("password", credentials.password);
      
//       const response = await axiosInstance.post("/auth/login", formData);
//       return response.data;
//     },

//   onSuccess: (data) => {
//   // 1. تعيين auth_token مع السماح بالربط بين النطاقات المختلفة محلياً
//   Cookies.set("auth_token", data.accessToken, { 
//     expires: 7, 
//     secure: true,        // إجباري مع SameSite=None
//     sameSite: "none"     // يسمح بمرور الكوكي من http (الفرونت) إلى https (الباك)
//   });

//   // 2. تعيين refresh_token بنفس الإعدادات لئلا يحظره المتصفح
//   Cookies.set("refresh_token", data.refreshToken, { 
//     expires: 30,
//     secure: true,        
//     sameSite: "none"     
//   });

//   // معلومات المستخدم العادية في localStorage
//   localStorage.setItem("user_info", JSON.stringify({ 
//     userId: data.userId, 
//     role: data.role, 
//     status: data.status 
//   }));

//   toast.success("تم تسجيل الدخول بنجاح");
//   setTimeout(() => navigate("/dashboard"), 500);
// },
//     onError: (error) => {
//       // معالجة الأخطاء القادمة من الانترسيبتور أو السيرفر
//       const errorMessage = error.response?.data?.message || "حدث خطأ غير متوقع";
//       toast.error(errorMessage);
//       console.error("Login Error:", error);
//     },
//   });

//   // معالج الإرسال (Submit Handler)
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const payload = Object.fromEntries(formData);

//     // التحقق الأولي (Client-side Validation)
//     if (!payload.username || !payload.password) {
//       toast.warning("يرجى إدخال جميع البيانات");
//       return;
//     }

//     mutate(payload);
//   };

//   return { handleLogin, isPending };
// };
  // features/auth/hooks/useLogin.js
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
      // 1. تعيين الأكسس توكن في الكوكيز
      Cookies.set("auth_token", data.accessToken, { 
        expires: 7, 
        secure: true,        
        sameSite: "none"     
      });

      // 2. تعيين الريفرش توكن في الكوكيز
      Cookies.set("refresh_token", data.refreshToken, { 
        expires: 30,
        secure: true,        
        sameSite: "none"     
      });

      // 3. تخزين الـ userId والـ role داخل الكوكيز بدلاً من الـ LocalStorage 🚀
      Cookies.set("user_id", data.userId, { expires: 7, secure: true, sameSite: "none" });
      Cookies.set("user_role", data.role, { expires: 7, secure: true, sameSite: "none" });

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
