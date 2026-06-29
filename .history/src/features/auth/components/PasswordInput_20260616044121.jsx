import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import BaseInput from "./BaseInput";

export default function PasswordInput({ name, placeholder, className, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group">
      <BaseInput
        {...props}
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className={`pl-12 ${className || ''}`}
      />
      {/* أيقونة القفل */}
      <Lock className="absolute top-1/2 -translate-y-1/2 right-4 text-primary" size={20} />
      
      {/* زر إظهار/إخفاء كلمة المرور */}
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
}