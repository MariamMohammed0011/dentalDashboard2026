import React from 'react';
import { Search } from 'lucide-react';

const DoctorsHeader = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex justify-between items-center mb-8 gap-6" dir="rtl">
      {/* حقل البحث */}
      <div className="relative flex-grow max-w-xl">
        <input 
          type="text" 
          placeholder="بحث.." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-gray-100 py-3.5 pr-12 pl-6 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-main font-medium placeholder-gray-400"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* عنوان الصفحة */}
      <div className="bg-white px-12 py-3.5 rounded-2xl font-black text-text-main text-lg border border-gray-100 shadow-sm">
        الاطباء
      </div>
    </div>
  );
};

export default DoctorsHeader;
