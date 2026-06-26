import React from 'react';
import { Search, SlidersHorizontal, ClipboardList } from 'lucide-react';

// استقبال الـ props الخاصة بالترتيب من المكون الأب
const OrdersHeader = ({ searchTerm, setSearchTerm, sortOrder, setSortOrder }) => {
  
  // دالة التبديل بين التصاعدي والتنازلي
  const handleToggleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center w-full mb-6 sm:mb-8 gap-4 sm:gap-6 px-0" dir="rtl">
      
      {/* حقل البحث والفلتر (أصبح في جهة الأزرار السابقة لتطابق الهيكل) */}
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

        {/* زر الترتيب التفاعلي */}
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
        </button>
      </div>

      {/* حاوية العنوان المحدثة بالكامل لتطابق بطاقة الإعلانات (نفس الخلفية، الحواف، الخط، واللون السكني الداكن) */}
      <div className="bg-white px-4 sm:px-10 py-3 rounded-2xl font-black text-text-main text-base sm:text-lg border border-gray-100 shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
        <ClipboardList size={20} className="text-text-main" /> {/* الأيقونة تأخذ نفس مقاس ولون النص تماماً */}
        <span>إدارة الطلبات</span>
      </div>
      
    </div>
  );
};

export default OrdersHeader;