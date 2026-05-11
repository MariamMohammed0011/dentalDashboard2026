import React from 'react';
import { Search } from 'lucide-react';

const DoctorsHeader = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-5 px-4 sm:px-6 bg-[#F8FAFC]/50 rounded-t-[2rem] border-b border-gray-100/50 gap-4" dir="rtl">
      {/* عنوان الصفحة - يمين */}
      <div className="shrink-0 w-full sm:w-auto text-right">
        <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-700">
          الاطباء
        </h1>  
      </div>
      
      {/* حقل البحث - يسار */}
      <div className="relative w-full sm:w-[320px]">
        <input 
          type="text" 
          placeholder="بحث.." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-gray-200 py-2.5 pr-4 pl-10 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 text-[13px] sm:text-[14px] font-medium text-text-main placeholder-gray-400"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default DoctorsHeader;
