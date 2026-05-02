import React from "react";
import { User } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import PasswordInput from "./PasswordInput";
import InputField from "./InputField";
import LoginIllustration from "./LoginIllustration";

export default function LoginForm() {
  const { handleLogin, isPending, error } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg p-4" dir="rtl">
      <div className="bg-gradient-to-br from-primary/40 via-primary/20 to-primary/0 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row border border-primary/20">
        
        {/* القسم الأيمن: نموذج تسجيل الدخول */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-800 mb-2">تسجيل دخول</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 text-red-700 p-3 rounded-xl border border-red-500/30 text-sm font-bold text-center">
                {error.message}
              </div>
            )}

            <InputField 
              label="اسم المستخدم"
              name="username" 
              type="text" 
              placeholder="أدخل اسم المستخدم"
              icon={User}
              required 
            />

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 mr-2">كلمة السر</label>
              <PasswordInput 
                name="password" 
                className="h-12 border-none shadow-inner" 
                placeholder="أدخل كلمة المرور"
                required 
              />
            </div>

            <div className="flex items-center justify-end px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-xs font-bold text-gray-600 group-hover:text-primary">تذكر حسابي</span>
                <input type="checkbox" className="w-4 h-4 rounded border-none text-primary focus:ring-0 shadow-sm" />
              </label>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full md:w-2/3 mx-auto block h-12 bg-primary text-white rounded-xl text-lg font-bold shadow-lg shadow-primary/40 hover:bg-primary-dark transition-all active:scale-95 disabled:bg-primary/50"
              >
                {isPending ? "جاري التحقق..." : "تسجيل دخول"}
              </button>
            </div>
          </form>
        </div>

        {/* القسم الأيسر: الصورة التوضيحية */}
        <LoginIllustration />
      </div>
    </div>
  );
}
