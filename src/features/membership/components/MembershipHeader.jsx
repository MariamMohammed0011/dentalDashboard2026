import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'doctor', label: 'الأطباء' },
  { id: 'lab', label: 'المخابر' },
];

const MembershipHeader = ({ activeTab, onTabChange, searchQuery, onSearchChange }) => {
  return (
    // تم تغيير العرض إلى w-full ليعطي مساحة أكبر لحقل البحث
    <div className="flex w-[70%] absolute top-1 right-0 flex-col gap-3 mb-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        
        {/* التبويبات بستايل انسيابي */}
        <div className="flex items-end bg-transparent px-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-10 py-3 text-sm font-bold transition-all duration-500 ${
                activeTab === tab.id
                  ? 'text-white z-20 tab-active-clip bg-[#367AFF]'
                  : 'text-text-muted hover:text-primary z-10'
              }`}
            >
              <span className="relative z-30">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* حقل البحث - تم زيادة العرض باستخدام flex-grow و max-w-2xl */}
        <div className="flex items-center gap-3 w-full md:flex-grow max-w-2xl pb-1">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="بحث عن طلب..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-border-main py-2 px-10 rounded-full text-sm font-medium text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          {/* زر الفلترة */}
          <button className="p-2 bg-white border border-border-main rounded-full text-gray-500 hover:text-primary hover:border-primary transition-all shadow-sm shrink-0">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>
      
      {/* الـ SVG المطلوب للقص الانسيابي (Clip Path) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="tabCurve" clipPathUnits="objectBoundingBox">
            <path d="M 0,1 
                     C 0.1,1 0.15,1 0.2,0.8 
                     C 0.25,0.6 0.25,0.2 0.3,0.1 
                     C 0.35,0 0.4,0 0.5,0 
                     L 0.6,0 
                     C 0.7,0 0.75,0 0.8,0.1 
                     C 0.85,0.2 0.85,0.6 0.9,0.8 
                     C 0.95,1 1,1 1,1 
                     Z" />
          </clipPath>
        </defs>
      </svg>

      <style jsx>{`
        .tab-active-clip {
          clip-path: url(#tabCurve);
        }
      `}</style>
    </div>
  );
};

export default MembershipHeader;