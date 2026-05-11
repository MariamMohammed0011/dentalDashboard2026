import React from 'react';
import { motion } from 'framer-motion';
import framerImg from '../../../assets/framer.png'; // تأكد من صحة المسار

const DoctorCard = ({ name, status, image }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden h-[220px] w-full border border-gray-100" 
      dir="rtl"
    >
      {/* 1. صورة الـ Framer كخلفية */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0">
        <img 
          src={framerImg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* 2. الصورة الشخصية */}
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-50">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      
      {/* 3. المعلومات */}
      <div className="text-center relative z-10 flex flex-col gap-1">
        <h3 className="font-bold text-text-main text-[15px] tracking-tight">
          د. {name}
        </h3>
        <p className="text-gray-500 text-[13px] font-medium">
          حالة الحساب: <span className="text-primary">{status}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default DoctorCard;