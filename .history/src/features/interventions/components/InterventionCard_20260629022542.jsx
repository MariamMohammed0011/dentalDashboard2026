import React from 'react';
import { motion } from 'framer-motion';

const InterventionCard = ({ intervention }) => {
  const { problemType, affectedParty, orderNumber, failedOperation } = intervention;

  
  const problemColor = problemType.includes('مرور') ? 'text-red-500' : problemType.includes('تنفيذ') ? 'text-yellow-600' : 'text-rose-600';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.2rem] sm:rounded-[1.5rem] flex flex-col overflow-hidden shadow-sm border border-gray-100 h-full transition-all hover:shadow-md group relative"
      dir="rtl"
    >
      
      <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${intervention.type === 'doctor' ? 'bg-orange-500' : 'bg-rose-500'} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-20 rounded-l-full`} />

      
      <div className="p-4 sm:p-5 flex flex-col gap-3 relative flex-grow">
        {/* نمط زخرفي */}
        <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle,rgba(54,122,255,0.4)_1px,transparent_1px)] bg-[size:8px_8px] sm:bg-[size:10px_10px]"></div>
        </div>

        <div className="text-right flex flex-col gap-2 sm:gap-3 relative z-10">
          <div className="text-[14px] sm:text-[15px] font-bold text-gray-700 leading-tight">
            نوع المشكلة: <span className={`${problemColor} block sm:inline mt-0.5 sm:mt-0`}>{problemType}</span>
          </div>
          
          <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-2 sm:pt-0 sm:border-0">
            <div className="text-[13px] sm:text-[14px] text-gray-600 font-medium">
              الطرف المتأثر: <span className="text-gray-500 font-bold">{affectedParty}</span>
            </div>
            <div className="text-[13px] sm:text-[14px] text-gray-600 font-medium">
              رقم الطلب: <span className="text-gray-500 font-bold">{orderNumber}</span>
            </div>
            <div className="text-[13px] sm:text-[14px] text-gray-600 font-medium leading-relaxed">
              العملية التي فشلت: <span className="text-gray-500 block mt-0.5">{failedOperation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* الجزء السفلي (أزرق) */}
      <button className="bg-[#E8F1FF] py-3 sm:py-2.5 text-primary font-bold text-[13px] sm:text-[14px] hover:bg-primary hover:text-white transition-all group-hover:bg-primary/5">
        عرض التفاصيل
      </button>
    </motion.div>
  );
};

export default InterventionCard;
