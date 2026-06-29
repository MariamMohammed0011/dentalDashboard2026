import React from 'react';
import { ClipboardList, Search, SlidersHorizontal } from 'lucide-react';


const OrdersHeader = ({ searchTerm, setSearchTerm, sortOrder, setSortOrder }) => {
  
  
  const handleToggleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-2 sm:py-3  bg-transparent border-b border-gray-200/50 gap-4 mb-2" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="shrink-0 w-full sm:w-auto text-right flex items-center gap-2">
        
         <div className="p-3.5 bg-[#E8F1FF] text-[#367AFF] rounded-2xl shadow-sm border border-[#D2E4FF]/50 flex items-center justify-center">
            <ClipboardList size={28} className="text-[#367AFF]" />
          </div>
        
        <h1 className="text-[18px] sm:text-[22px] font-bold text-gray-700">
          ادارة طلبات الأطباء
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

        {/* زر الترتيب التفاعلي المعدل */}
        <button 
          onClick={handleToggleSort}
          title={sortOrder === 'asc' ? "ترتيب تنازلي (الأحدث أولاً)" : "ترتيب تصاعدي (الأقدم أولاً)"}
          className={`p-2.5 rounded-full border transition-all shadow-sm flex-shrink-0 flex items-center gap-1.5 cursor-pointer
            ${sortOrder === 'desc' 
              ? 'bg-primary/10 text-primary border-primary/30' 
              : 'bg-white text-gray-500 border-gray-200 hover:text-primary hover:border-primary/30'
            }`}
        >
          <SlidersHorizontal size={18} />
          {/* <span className="text-[11px] font-bold px-0.5">
            {sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
          </span> */}
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;