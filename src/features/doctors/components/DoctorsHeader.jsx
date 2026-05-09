import React from 'react';
import { Search } from 'lucide-react';

const DoctorsHeader = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="sticky top-0 z-30 flex justify-between items-center py-4 px-2 bg-[#F0F0F0]/80 backdrop-blur-md gap-6 mb-2 transition-all duration-300" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="px-12 py-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-main tracking-tight">
          الأطباء
        </h1>  
      </div>
      {/* حقل البحث */}
      <div className="relative flex-grow max-w-xl ">
        <input 
          type="text" 
          placeholder="بحث.." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-gray-100 py-2 pr-3 pl-6 rounded-[1rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-main font-medium placeholder-gray-400"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </div>
  );
};

export default DoctorsHeader;
