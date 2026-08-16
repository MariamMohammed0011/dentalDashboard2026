import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, RotateCcw, Filter, FlaskConical, Star, Activity, Sparkles } from 'lucide-react';

// ── Color presets for each filter type (تم إضافة ألوان الحدود الأساسية) ──
const colorPresets = {
  emerald: {
    border: 'border-emerald-500/40 dark:border-emerald-500/30',
    active: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20',
    icon: 'text-emerald-500',
    selected: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    check: 'text-emerald-500',
    ring: 'focus:ring-emerald-500/20',
  },
  amber: {
    border: 'border-amber-500/40 dark:border-amber-500/30',
    active: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'text-amber-500',
    selected: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    check: 'text-amber-500',
    ring: 'focus:ring-amber-500/20',
  },
  blue: {
    border: 'border-blue-500/40 dark:border-blue-500/30',
    active: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20',
    icon: 'text-blue-500',
    selected: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    check: 'text-blue-500',
    ring: 'focus:ring-blue-500/20',
  },
  violet: {
    border: 'border-violet-500/40 dark:border-violet-500/30',
    active: 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20',
    icon: 'text-violet-500',
    selected: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
    check: 'text-violet-500',
    ring: 'focus:ring-violet-500/20',
  },
};

// ── Custom Dropdown Component ──
const FilterDropdown = ({ label, icon: Icon, value, options, onChange, colorKey = 'emerald' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const colors = colorPresets[colorKey];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find(o => o.id === value)?.label || label;
  const isFiltered = value !== 'all' && value !== '';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full bg-white dark:bg-slate-900 font-bold text-[13px] sm:text-sm rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring} transition-all duration-200 cursor-pointer ${isFiltered
            ? colors.active
            : `${colors.border} text-slate-800 dark:text-slate-100`
          }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={24} className={`shrink-0 ${colors.icon}`} />}
          <span className="truncate text-[12px] font-zain font-black">{currentLabel}</span>
        </div>
        <ChevronDown
          size={20}
          className={`text-slate-400 dark:text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-full min-w-[180px] bg-white dark:bg-slate-900 border ${colors.border} rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 max-h-[250px] overflow-y-auto custom-scrollbar`}>
          {options.map((option) => {
            const isSelected = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-[calc(100%-8px)] mx-auto px-3 sm:px-4 py-2 sm:py-2.5 text-right text-[11px] sm:text-xs font-bold transition-all duration-200 rounded-xl cursor-pointer ${isSelected
                    ? colors.selected
                    : 'text-gray-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-text-main dark:hover:text-white'
                  }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={13} className={colors.check} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ── Main LabsFilter Component ──
const LabsFilter = ({
  statusFilter,
  onStatusChange,
  ratingSort,
  onRatingSortChange,
  availabilityFilter,
  onAvailabilityChange,
  scanVisitFilter,
  onScanVisitChange,
  onResetFilters,
  hasActiveFilters
}) => {


  const statusOptions = [
    { id: 'all', label: 'كل الحالات' },
    { id: 'active', label: 'نشط' },
    { id: 'pendingverification', label: 'قيد التثبت' },
    { id: 'pendingadminapproval', label: 'قيد المراجعة' },
    { id: 'readonly', label: 'قراءة فقط' },
    { id: 'suspended', label: 'معلق' },
    { id: 'rejected', label: 'مرفوض' },
  ];


  const ratingOptions = [
    { id: 'all', label: 'بدون ترتيب' },
    { id: 'desc', label: 'الأعلى تقييماً أولاً' },
    { id: 'asc', label: 'الأقل تقييماً أولاً' },
  ];


  const availabilityOptions = [
    { id: 'all', label: 'كل المخابر' },
    { id: 'available', label: 'متاح' },
    { id: 'unavailable', label: 'غير متاح' },
  ];


  const scanVisitOptions = [
    { id: 'all', label: 'كل الخدمات' },
    { id: 'yes', label: 'يدعم خدمة Scan Visit' },
    { id: 'no', label: 'لا يدعم خدمة Scan Visit' },
  ];

  return (
    <div className="w-full font-ruqaa flex flex-col gap-3 sm:gap-4 relative z-10" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
        {/* Rating Sort */}
        <FilterDropdown
          label="متوسط التقييم"
          icon={Star}
          value={ratingSort}
          options={ratingOptions}
          onChange={onRatingSortChange}
          colorKey="amber"
        />

        <FilterDropdown
          label="حالة التوفر"
          icon={Activity}
          value={availabilityFilter}
          options={availabilityOptions}
          onChange={onAvailabilityChange}
          colorKey="blue"
        />

        <FilterDropdown
          label="الخدمات"
          icon={Sparkles}
          value={scanVisitFilter}
          options={scanVisitOptions}
          onChange={onScanVisitChange}
          colorKey="violet"
        />
      </div>
    </div>

  );
};

export default LabsFilter;