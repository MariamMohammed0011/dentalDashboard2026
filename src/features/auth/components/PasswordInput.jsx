import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordInput({ name, placeholder, className, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className={`w-full h-12 pr-12 pl-12 rounded-xl border-none bg-white shadow-inner focus:ring-2 focus:ring-primary/50 outline-none transition-all text-right ${className || ''}`}
        {...props}
      />
      {/* أيقونة القفل */}
      <Lock className="absolute top-1/2 -translate-y-1/2 right-4 text-primary" size={20} />
      
      {/* زر إظهار/إخفاء كلمة المرور */}
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}