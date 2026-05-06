import React from 'react';
import { motion } from 'framer-motion';

const InterventionCard = ({ intervention }) => {
  const { problemType, affectedParty, orderNumber, failedOperation } = intervention;

  // تحديد اللون بناءً على نوع المشكلة (للمحاكاة)
  const problemColor = problemType.includes('مرور') ? 'text-red-500' : problemType.includes('تنفيذ') ? 'text-yellow-600' : 'text-rose-600';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] flex flex-col overflow-hidden shadow-sm border border-gray-100 h-full transition-all hover:shadow-md"
      dir="rtl"
    >
      {/* الجزء العلوي (أبيض) */}
      <div className="p-5 flex flex-col gap-3 relative flex-grow">
        {/* نمط زخرفي */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle,rgba(54,122,255,0.4)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        </div>

        <div className="text-right flex flex-col gap-2 relative z-10">
          <div className="text-[15px] font-bold text-gray-700">
            نوع المشكلة: <span className={problemColor}>{problemType}</span>
          </div>
          <div className="text-[14px] text-gray-600 font-medium">
            الطرف المتأثر: <span className="text-gray-500">{affectedParty}</span>
            <span className="mx-2 text-gray-300">|</span>
            رقم الطلب: <span className="text-gray-500">{orderNumber}</span>
          </div>
          <div className="text-[14px] text-gray-600 font-medium">
            العملية التي فشلت: <span className="text-gray-500">{failedOperation}</span>
          </div>
        </div>
      </div>

      {/* الجزء السفلي (أزرق) */}
      <button className="bg-[#E8F1FF] py-2.5 text-primary font-bold text-[14px] hover:bg-primary hover:text-white transition-all">
        عرض التفاصيل
      </button>
    </motion.div>
  );
};

export default InterventionCard;
