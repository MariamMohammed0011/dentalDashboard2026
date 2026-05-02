import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials) => {
      // محاكاة عملية تسجيل الدخول
      if (credentials.username === "admin" && credentials.password === "123456") {
        return { token: "mock_token_123" };
      }
      throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      // استخدام window.location.href لضمان إعادة تحميل الحالة أو navigate
      window.location.href = "/dashboard";
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
