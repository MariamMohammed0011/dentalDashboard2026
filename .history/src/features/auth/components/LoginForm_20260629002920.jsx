import React from "react";
import { User, Loader } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import PasswordInput from "./PasswordInput";
import InputField from "./InputField";
import LoginIllustration from "./LoginIllustration";

export default function LoginForm() {
  const { handleLogin, isPending, error } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg p-4" dir="rtl">
      <div className="bg-gradient-to-bl from-primary/40 via-primary/20 to-primary/0 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col border border-primary/20">
        
        
        <div className="text-center pt-8 pb-2 bg-white/10 backdrop-blur-md ">
           <h1 className="text-3xl font-bold text-gray-800">ابتسامتك، إدارتنا</h1>
        </div>

        <div className="flex flex-col md:flex-row flex-grow">
          
          <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white/10 backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-5">


            <InputField
              label="البريد الالكتروني "
              name="username"
              type="text"
              placeholder="ادخل بريدك الالكتروني  "
              icon={User}
              required
            />

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 mr-2">كلمة السر</label>
              <PasswordInput
                name="password"
                className="h-12 border-none shadow-inner"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <div className="flex items-center justify-start px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" name="rememberMe"  className="w-4 h-4 rounded border-none text-primary focus:ring-0 shadow-sm" />

                <span className="text-xs font-bold text-gray-600 group-hover:text-primary">تذكر حسابي</span>
              </label>
            </div>

            <div className="pt-4">
              <button
  type="submit"
  disabled={isPending}
  className="w-full md:w-2/3 mx-auto flex items-center justify-center gap-3 h-12 bg-primary-dark text-white rounded-xl text-lg font-medium shadow-lg transition-all active:scale-95 disabled:bg-primary/70 disabled:cursor-wait"
>
  {isPending ? (
    <>
       <Loader className="animate-spin text-white" size={24} strokeWidth={3} />
      <span className="tracking-wide">جاري التحقق...</span>
    </>
  ) : (
    "تسجيل دخول"
  )}
</button>
            </div>
          </form>
        </div>

        {/* القسم الأيسر: الصورة التوضيحية */}
        <LoginIllustration />
      </div>
    </div>
  </div>
  );
}

