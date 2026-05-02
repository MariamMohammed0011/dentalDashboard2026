import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials) => {
      // 1. إضافة تأخير اصطناعي هنا (أهم خطوة)
      // هذا يجعل useMutation تظل في حالة isPending لمدة ثانيتين
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2. محاكاة التحقق
      if (credentials.username === "admin" && credentials.password === "123456") {
        return { token: "mock_token_123" };
      }
      throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
    },
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      localStorage.setItem("auth_token", data.token);

      // هنا يتم التوجيه فوراً لأننا انتظرنا بالفعل في الخطوة السابقة
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(Object.fromEntries(formData));
  };

  return {
    handleLogin,
    isPending,
    error
  };
};