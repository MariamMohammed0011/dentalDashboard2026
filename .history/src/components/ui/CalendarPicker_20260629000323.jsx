import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر'
];

const WEEKDAYS_AR = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة'
];


const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
};


const formatDateStr = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};


const getDisplayLabel = (dateStr, placeholder = 'اختر التاريخ') => {
  const date = parseDate(dateStr);
  if (!date) return placeholder;
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateStr; 
  }
};

const CalendarPicker = ({ value, onChange, placeholder = 'اختر التاريخ', disabled = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  
  useEffect(() => {
    if (isOpen && value) {
      const parsed = parseDate(value);
      if (parsed) {
        setViewMonth(parsed.getMonth());
        setViewYear(parsed.getFullYear());
      }
    }
  }, [isOpen, value]);

  
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  
  const emptyCellsCount = (firstDayIndex + 1) % 7;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    const formatted = formatDateStr(selectedDate);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  
  const currentYearNum = new Date().getFullYear();
  const yearOptions = Array.from({ length: 15 }, (_, i) => currentYearNum - 2 + i);

  
  const parsedSelected = parseDate(value);
  const isSelected = (day) => {
    return parsedSelected && 
           parsedSelected.getDate() === day && 
           parsedSelected.getMonth() === viewMonth && 
           parsedSelected.getFullYear() === viewYear;
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewMonth && 
           today.getFullYear() === viewYear;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-10 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
            value ? "text-gray-800 font-bold" : "text-gray-400",
            className
          )}
        >
          <span className="truncate">{getDisplayLabel(value, placeholder)}</span>
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-200/60 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent align="start" className="w-80 p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-2xl z-[99999]" dir="rtl">
        
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={handleNextMonth} // In RTL, going to "next" month visually moves right, but wait, usually:
            // Right arrow (in RTL) goes to next month. Let's make it intuitive.
            // Let's use standard right arrow for next, left arrow for prev.
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
          
          <div className="flex items-center gap-1.5">
            {/* Month Select */}
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
              className="bg-transparent border-0 font-bold text-gray-800 dark:text-gray-100 text-sm outline-none cursor-pointer focus:ring-0 py-0 px-1 text-center"
            >
              {MONTHS_AR.map((month, idx) => (
                <option key={idx} value={idx} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  {month}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
              className="bg-transparent border-0 font-bold text-gray-800 dark:text-gray-100 text-sm outline-none cursor-pointer focus:ring-0 py-0 px-1 text-center"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS_AR.map((day, idx) => (
            <span key={idx} className="text-gray-400 dark:text-gray-500 font-bold text-xs py-1">
              {day.substring(0, 3)}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Render empty cells for days of prev month */}
          {Array.from({ length: emptyCellsCount }).map((_, idx) => (
            <span key={`empty-${idx}`} className="py-2 text-transparent text-sm">
              -
            </span>
          ))}

          {/* Render days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const selected = isSelected(day);
            const today = isToday(day);

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={() => handleSelectDay(day)}
                className={cn(
                  "py-2 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center h-9 w-9 mx-auto",
                  selected 
                    ? "bg-[#367AFF] text-white shadow-lg shadow-blue-500/20" 
                    : today
                      ? "bg-blue-50 text-[#367AFF] dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarPicker;
