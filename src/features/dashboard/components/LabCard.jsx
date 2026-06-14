import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ChevronLeft } from 'lucide-react';
import framerImg from '../../../assets/framer.png';

const LabCard = ({ id, name, onShowDetails }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-bg-card rounded-[2.5rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden h-[220px] w-full border border-slate-100 dark:border-slate-800" 
      dir="rtl"
    >
      {/* 1. Background Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <img 
          src={framerImg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
        {/* Upper: Icon & Title */}
        <div className="flex items-center gap-4">
          {/* Lab Icon Container */}
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none transition-transform group-hover:scale-110 duration-300">
            <FlaskConical size={26} />
          </div>
          
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase">مخبر تعويضات</span>
            <h3 className="font-bold text-text-main dark:text-gray-100 text-[15px] tracking-tight truncate leading-tight">
              {name}
            </h3>
          </div>
        </div>

        {/* Lower: Info & CTA */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">مخبر رقم: #{id}</span>
          
          <button 
            onClick={() => onShowDetails(id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white rounded-xl text-xs font-black transition-all active:scale-95 group/btn"
          >
            عرض التفاصيل
            <ChevronLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LabCard;
