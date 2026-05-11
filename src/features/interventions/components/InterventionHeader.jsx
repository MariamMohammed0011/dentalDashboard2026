import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'doctor', label: 'أطباء' },
  { id: 'lab', label: 'المخابر' },
];

const InterventionHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col w-full lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-6 px-2" dir="rtl">
      {/* العنوان والتبويبات */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
        <h1 className="text-xl sm:text-2xl font-black text-gray-800 whitespace-nowrap">طلبات التدخل:</h1>
        
        <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-[1.2rem] sm:rounded-[1.5rem] border border-gray-100 shadow-sm relative overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 sm:px-8 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black transition-all duration-300 z-10 ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-primary'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-primary rounded-lg sm:rounded-xl shadow-[0_5px_15px_rgba(54,122,255,0.4)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* زر إنشاء طلب يدوي */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="bg-blue-700 text-white w-full lg:w-auto px-2 py-1 sm:py-3 rounded-xl sm:rounded-2xl font-black shadow-lg shadow-blue-700/30 flex items-center justify-center gap-2 hover:bg-blue-800 transition-all text-sm sm:text-base"
      >
        <Plus className="w-5 h-5" />
        انشاء طلب يدوي
      </motion.button>
    </div>
  );
};

export default InterventionHeader;
