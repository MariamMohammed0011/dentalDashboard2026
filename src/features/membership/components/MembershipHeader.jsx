import React from 'react';
import { useTranslation } from 'react-i18next';
import Search from '../../../components/shared/Search/Search';

const MembershipHeader = ({ activeTab, onTabChange, searchQuery, onSearchChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'all', label: t('common.all') },
    { id: 'doctor', label: t('doctors.title') },
    { id: 'lab', label: t('labs.title') },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center pt-0 pb-2 sm:pb-3 px-4 sm:px-8 gap-4 md:gap-6 w-full md:mt-2 sm:mt-2 " dir="rtl">
        
        <div className="flex items-end bg-transparent px-1 overflow-x-auto custom-scrollbar w-full md:w-auto pb-1 md:pb-0 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 sm:px-10 py-2.5 text-[14px] sm:text-[15px] font-bold transition-all duration-500 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white z-20 tab-active-clip bg-[#367AFF]'
                  : 'text-text-muted hover:text-primary z-10'
              }`}
            >
              <span className="relative z-30">{tab.label}</span>
            </button>
          ))}
        </div>

         <div className="w-full md:w-[350px] md:max-w-[350px] shrink-0">
          <Search 
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={t('membership.searchPlaceholder')}
            width="100%" 
            className="w-full"
            onClear={() => onSearchChange('')}
          />
        </div>
      </div>
        
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