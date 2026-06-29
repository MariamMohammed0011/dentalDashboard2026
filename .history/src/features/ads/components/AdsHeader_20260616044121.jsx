import React from 'react';
import { Plus, PowerOff } from 'lucide-react';

const AdsHeader = () => {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center w-full mb-6 sm:mb-8 gap-4 sm:gap-6 px-0" dir="rtl">
      {/* الأزرار */}
      <div className="flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <button className="flex-1 sm:flex-initial justify-center bg-[#367AFF] text-white px-4 sm:px-8 py-2.5 rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-600 transition-all text-sm whitespace-nowrap">
          إضافة اعلان
        </button>
        <button className="flex-1 sm:flex-initial justify-center bg-[#FFD9D9] text-[#E11D48] px-4 sm:px-8 py-2.5 rounded-2xl font-black flex items-center gap-2 hover:bg-red-100 transition-all text-sm whitespace-nowrap">
          إيقاف اعلان
        </button>
      </div>

      {/* العنوان */}
      <div className="bg-white px-4 sm:px-10 py-3 rounded-2xl font-black text-text-main text-base sm:text-lg border border-gray-100 shadow-sm text-center w-full sm:w-auto">
        الإعلانات
      </div>
    </div>
  );
};

export default AdsHeader;
