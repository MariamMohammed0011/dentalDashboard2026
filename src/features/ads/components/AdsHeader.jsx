import React from 'react';
import { Plus, PowerOff } from 'lucide-react';

const AdsHeader = () => {
  return (
    <div className="flex w-[60%]  flex-col md:flex-row justify-between items-center mb-8 gap-6 px-2" dir="rtl">
      {/* الأزرار */}
      <div className="flex items-center gap-4">
        <button className="bg-[#367AFF] text-white px-8 py-2.5 rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-600 transition-all text-sm">
          إضافة اعلان
        </button>
        <button className="bg-[#FFD9D9] text-[#E11D48] px-8 py-2.5 rounded-2xl font-black flex items-center gap-2 hover:bg-red-100 transition-all text-sm">
          إيقاف اعلان
        </button>
      </div>

      {/* العنوان */}
      <div className="bg-white px-10 py-3 rounded-2xl font-black text-text-main text-lg border border-gray-100 shadow-sm">
        الإعلانات
      </div>
    </div>
  );
};

export default AdsHeader;
