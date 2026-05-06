import React from 'react';
import { motion } from 'framer-motion';

const AdCard = ({ ad }) => {
  const { source, duration, paymentStatus, image } = ad;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] flex items-stretch overflow-hidden shadow-sm border border-gray-100 h-[100px] group hover:shadow-md transition-all"
      dir="rtl"
    >
      {/* الصورة (يمين في RTL) */}
      <div className="w-[100px] h-full flex-shrink-0 relative overflow-hidden">
        <img src={image} alt="Ad" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* التفاصيل (وسط) */}
      <div className="flex-grow p-3 flex flex-col justify-center gap-1 text-right relative overflow-hidden">
         {/* نمط زخرفي */}
         <div className="absolute top-0 right-0 w-16 h-full opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle,rgba(54,122,255,0.4)_1px,transparent_1px)] bg-[size:8px_8px]"></div>
        </div>

        <div className="text-[13px] font-bold text-gray-700 relative z-10">
          المصدر: <span className="font-medium text-gray-500">{source}</span>
        </div>
        <div className="text-[13px] font-bold text-gray-700 relative z-10">
          مدة الإعلان: <span className="font-medium text-gray-500">{duration}</span>
        </div>
        <div className="text-[13px] font-bold text-gray-700 relative z-10">
          حالة الدفع: <span className="font-medium text-gray-500">{paymentStatus}</span>
        </div>
      </div>

      {/* زر العرض (يسار في RTL) */}
      <div className="w-[45px] bg-[#367AFF] flex items-center justify-center text-white font-bold text-[13px] cursor-pointer hover:bg-primary-dark transition-colors vertical-text">
        عرض
      </div>
    </motion.div>
  );
};

export default AdCard;
