import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const OrdersHeader = () => {
  return (
    <div className="flex w-[70%] absolute top-3 right-4  flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 sm:gap-4" dir="rtl">
      {/* عنوان الصفحة */}
      <h1 className="text-lg md:text-2xl font-bold text-text-main whitespace-nowrap">إدارة الطلبات:</h1>

      {/* حقل البحث والفلتر */}
      <div className="flex items-center gap-2 w-full sm:w-auto flex-grow max-w-lg">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="بحث"
            className="w-full bg-[#E5E7EB] border-none py-2 px-10 rounded-full text-sm font-medium text-text-main placeholder-gray-500 focus:ring-0 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        </div>
        <button className="p-2 text-gray-500 hover:text-primary transition-colors flex-shrink-0">
          <SlidersHorizontal size={22} />
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;
