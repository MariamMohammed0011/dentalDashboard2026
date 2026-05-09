import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'doctor', label: 'الأطباء' },
  { id: 'lab', label: 'المخابر' },
];

const MembershipHeader = ({ activeTab, onTabChange, searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col gap-6 w-[60%] mb-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        {/* التبويبات بستايل انسيابي جداً */}
        <div className="flex items-end bg-transparent px-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-10 py-3.5 text-sm font-bold transition-all duration-500 ${
                activeTab === tab.id
                  ? 'bg-primary text-white rounded-t-[2rem] z-20 shadow-[0_-8px_15px_rgba(54,122,255,0.15)]'
                  : 'text-text-muted hover:text-primary z-10'
              }`}
            >
              <span className="relative z-30">{tab.label}</span>
              
              {/* تأثير الانسيابية (Concave Corners) باستخدام SVG لدقة متناهية */}
              {activeTab === tab.id && (
                <>
                  {/* المنحنى الأيسر */}
                  <div className="absolute bottom-0 -left-[30px] w-[30px] h-[30px] pointer-events-none">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 30V0C30 16.5685 16.5685 30 0 30H30Z" fill="#367AFF"/>
                    </svg>
                  </div>
                  {/* المنحنى الأيمن */}
                  <div className="absolute bottom-0 -right-[30px] w-[30px] h-[30px] pointer-events-none">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 30V0C0 16.5685 13.4315 30 30 30H0Z" fill="#367AFF"/>
                    </svg>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* حقل البحث */}
        <div className="flex items-center gap-2 w-full md:w-auto max-w-md pb-1">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="بحث عن طلب..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-border-main py-2.5 px-10 rounded-full text-sm font-medium text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="p-2.5 bg-white border border-border-main rounded-full text-gray-500 hover:text-primary hover:border-primary transition-all shadow-sm">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>
      {/* خط فاصل سفلي يندمج مع المنحنيات */}
      <div className="h-[3px] w-full bg-white/40 -mt-[3px] rounded-full"></div>
    </div>
  );
};

export default MembershipHeader;
