import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // 1. استيراد useNavigate

export const useLogin = () => {
  const navigate = useNavigate(); // 2. تعريف هوك التنقل

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials) => {
      // إضافة تأخير لمدة ثانيتين لرؤية اللودر بوضوح
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // محاكاة التحقق من البيانات
      if (credentials.username === "admin" && credentials.password === "123456") {
        return { token: "mock_token_123" };
      }
      
      // في حال الخطأ
      throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
    },
    onSuccess: (data) => {
      // 3. تخزين التوكن أولاً
      localStorage.setItem("auth_token", data.token);

      // 4. إظهار رسالة النجاح
      toast.success("تم تسجيل الدخول بنجاح! جاري تحويلك...");

      // 5. الانتقال للداشبورد باستخدام navigate لضمان عدم اختفاء التوستر
      // أضفنا تأخير بسيط (500ms) فقط ليعطي جمالية في رؤية الرسالة قبل الانتقال
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    },
    onError: (error) => {
      // إظهار رسالة الخطأ في حال فشل تسجيل الدخول
      toast.error(error.message);
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // استدعاء الميوتيشن
    mutate(data);
  };

  return {
    handleLogin,
    isPending,
    error
  };
};