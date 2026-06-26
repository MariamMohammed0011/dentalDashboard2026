import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const OrdersHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-2 sm:py-3 px-2 sm:px-4 bg-transparent border-b border-gray-200/50 gap-4 mb-2" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="shrink-0 w-full sm:w-auto text-right">
        <h1 className="text-[18px] sm:text-[22px] font-bold text-gray-700">
          إدارة الطلبات
        </h1>
      </div>

      {/* حقل البحث والفلتر */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-grow max-w-lg">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث عن طريق رقم الطلب، الطبيب، أو المخبر..."
            className="w-full bg-white border border-gray-200 py-2.5 pr-4 pl-10 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 text-[13px] sm:text-[14px] font-medium text-text-main placeholder-gray-400 text-right"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm flex-shrink-0">
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;