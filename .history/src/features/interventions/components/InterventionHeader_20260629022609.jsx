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
    <div className="flex flex-col w-full lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-6 px-0" dir="rtl">
      
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          طلبات التدخل
        </h1>
        
        
        <div className="flex  p-1.5 rounded-2xl bg-white border border-slate-200/60 shadow-inner relative w-full sm:w-auto overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 z-10 flex-1 sm:flex-none ${
                activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* القسم الأيسر: زر الإنشاء - تم تحديثه ليتناسب مع "روح" التبويبات */}
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="group relative bg-white text-blue-600 hover:text-white border-2 border-blue-600 w-full lg:w-auto px-6 py-2.5 rounded-2xl font-black transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 shadow-md shadow-blue-100"
      >
        {/* تأثير تعبئة الخلفية عند الهوفر */}
        <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
          <span className="text-sm sm:text-base">إنشاء طلب يدوي</span>
        </div>
      </motion.button>
      
    </div>
  );
};

export default InterventionHeader;