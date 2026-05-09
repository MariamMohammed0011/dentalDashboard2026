import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const ReportsHeader = () => {
  return (
    <div className="flex flex-col w-[60%]  md:flex-row justify-between items-center mb-8 gap-6 px-2" dir="rtl">
      {/* الفلاتر */}
      <div className="flex items-center gap-4 flex-grow max-w-2xl">
        <div className="relative flex-grow">
          <div className="bg-white border border-gray-100 py-2.5 px-6 rounded-2xl shadow-sm flex items-center justify-between text-gray-500 font-bold text-sm cursor-pointer">
            <span>نوع التقرير</span>
            <ChevronDown size={18} />
          </div>
        </div>
        <div className="relative flex-grow">
          <div className="bg-white border border-gray-100 py-2.5 px-6 rounded-2xl shadow-sm flex items-center gap-3 text-gray-500 font-bold text-sm cursor-pointer">
            <Calendar size={18} className="text-gray-400" />
            <span>المدة الزمنية</span>
          </div>
        </div>
      </div>

      {/* العنوان */}
      <div className="bg-white px-10 py-3 rounded-2xl font-black text-text-main text-lg border border-gray-100 shadow-sm">
        التقارير
      </div>
    </div>
  );
};

export default ReportsHeader;
