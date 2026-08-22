import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomSelect = ({ value, onChange, options, placeholder = '', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full font-zain ${className}`} ref={dropdownRef}>
      {/* زر التحديد الرئيسي (Trigger Button) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2.5 px-4 rounded-2xl text-sm font-bold bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 border transition-all duration-200 flex items-center justify-between cursor-pointer shadow-xs select-none ${
          isOpen 
            ? 'border-primary ring-2 ring-primary/20 shadow-md' 
            : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'
        }`}
      >
        <span className="truncate text-right">{selectedOption?.label || placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 dark:text-slate-300 shrink-0 mr-2"
        >
          <ChevronDown size={17} />
        </motion.div>
      </button>

      {/* القائمة المنسدلة (Dropdown Menu) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 z-50 p-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-0.5 overflow-hidden font-zain backdrop-blur-md"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors text-right cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary dark:text-blue-400 dark:bg-blue-950/50'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={15} className="text-primary dark:text-blue-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;