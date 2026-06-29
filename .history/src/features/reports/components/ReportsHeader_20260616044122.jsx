import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const ReportsHeader = () => {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center w-full mb-6 sm:mb-8 gap-4 sm:gap-6 px-0" dir="rtl">
      {/* الفلاتر */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4 flex-grow max-w-2xl w-full sm:w-auto">
        <div className="relative flex-grow">
          <div className="bg-white border border-gray-100 py-2.5 px-4 sm:px-6 rounded-2xl shadow-sm flex items-center justify-between text-gray-500 font-bold text-sm cursor-pointer hover:border-gray-200 transition-colors">
            <span>نوع التقرير</span>
            <ChevronDown size={18} />
          </div>
        </div>
        <div className="relative flex-grow">
          <div className="bg-white border border-gray-100 py-2.5 px-4 sm:px-6 rounded-2xl shadow-sm flex items-center justify-between text-gray-500 font-bold text-sm cursor-pointer hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar size={18} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">المدة الزمنية</span>
            </div>
            <ChevronDown size={18} className="flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* العنوان */}
      <div className="bg-white px-4 sm:px-10 py-3 rounded-2xl font-black text-text-main text-base sm:text-lg border border-gray-100 shadow-sm text-center w-full sm:w-auto">
        التقارير
      </div>
    </div>
  );
};

export default ReportsHeader;
