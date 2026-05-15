import Search from '../../../components/shared/Search/Search';

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'doctor', label: 'الأطباء' },
  { id: 'lab', label: 'المخابر' },
  
];

const MembershipHeader = ({ activeTab, onTabChange, searchQuery, onSearchChange }) => {
  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between items-center pt-0 pb-2 sm:pb-3 px-4 sm:px-8 gap-6" dir="rtl">
        
        {/* التبويبات - يمين */}
        <div className="flex items-end bg-transparent px-1 shrink-0 overflow-x-auto custom-scrollbar w-full xl:w-auto pb-1 xl:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-8 sm:px-12 py-2.5 text-[14px] sm:text-[15px] font-bold transition-all duration-500 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white z-20 tab-active-clip bg-[#367AFF]'
                  : 'text-text-muted hover:text-primary z-10'
              }`}
            >
              <span className="relative z-30">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* حقل البحث - يسار */}
        <Search 
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="بحث عن طلب..."
          width="350px"
          className="w-full xl:w-[350px]"
          onClear={() => onSearchChange('')}
        />
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
    </>
  );
};

export default MembershipHeader;