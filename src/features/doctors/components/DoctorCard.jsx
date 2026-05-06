import React from 'react';
import { motion } from 'framer-motion';

const DoctorCard = ({ name, status, image }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-8 flex flex-col items-center gap-6 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(54,122,255,0.12)] transition-all duration-500 group relative overflow-hidden" 
      dir="rtl"
    >
      {/* نمط زخرفي متطور في الخلفية */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle,rgba(54,122,255,0.6)_1.5px,transparent:1.5px)] bg-[size:15px_15px]"></div>
      </div>
      
      {/* الهالة خلف الصورة */}
      <div className="absolute top-12 w-28 h-28 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-500" />

      {/* الصورة الشخصية الكبيرة */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      
      {/* المعلومات مع خطوط أكبر */}
      <div className="text-center relative z-10 flex flex-col gap-2">
        <h3 className="font-black text-text-main text-2xl group-hover:text-primary transition-colors duration-300">{name}</h3>
        <div className="inline-block px-4 py-1.5 bg-primary/5 rounded-full">
          <p className="text-primary text-sm font-bold tracking-wide uppercase">{status}</p>
        </div>
      </div>

      {/* زر تفاعلي سفلي (اختياري للمنظر) */}
      <div className="mt-2 w-12 h-1.5 bg-gray-100 rounded-full group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
    </motion.div>
  );
};

export default DoctorCard;
