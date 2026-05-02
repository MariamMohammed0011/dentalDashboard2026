import React from 'react';
import loginImg from "../../../assets/login.png";

export default function LoginIllustration() {
  return (
    <div className="md:w-1/2 flex items-center justify-center p-12 bg-white/10 backdrop-blur-sm">
      <img 
        src={loginImg} 
        alt="Dental Care Illustration" 
        className="w-full max-w-sm drop-shadow-2xl object-contain"
      />
    </div>
  );
}
