import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'doctor', label: 'أطباء' },
  { id: 'lab', label: 'المخابر' },
];

const InterventionHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col w-[60%] md:flex-row justify-between items-center mb-8 gap-6 px-2" dir="rtl">
      {/* العنوان والتبويبات */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-black text-gray-800">طلبات التدخل:</h1>
        
        <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-8 py-2 rounded-xl text-sm font-black transition-all duration-300 z-10 ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-primary'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-primary rounded-xl shadow-[0_5px_15px_rgba(54,122,255,0.4)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterventionHeader;
