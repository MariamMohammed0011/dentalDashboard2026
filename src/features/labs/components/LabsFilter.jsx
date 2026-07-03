import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, RotateCcw, Filter, FlaskConical, Star, Wrench, Sparkles } from 'lucide-react';

// ── Color presets for each filter type ──
const colorPresets = {
  emerald: {
    active: 'border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20',
    icon: 'text-emerald-500',
    selected: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    check: 'text-emerald-500',
    ring: 'focus:ring-emerald-500/20',
  },
  amber: {
    active: 'border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'text-amber-500',
    selected: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    check: 'text-amber-500',
    ring: 'focus:ring-amber-500/20',
  },
  blue: {
    active: 'border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20',
    icon: 'text-blue-500',
    selected: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    check: 'text-blue-500',
    ring: 'focus:ring-blue-500/20',
  },
  violet: {
    active: 'border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20',
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
        className={`flex items-center justify-between gap-2 w-full bg-white dark:bg-slate-900 font-bold text-[11px] sm:text-xs rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring} transition-all duration-200 cursor-pointer ${
          isFiltered 
            ? colors.active
            : 'border-slate-100 dark:border-slate-800/80 text-text-main dark:text-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={14} className={`shrink-0 ${colors.icon}`} />}
          <span className="truncate">{currentLabel}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full min-w-[180px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 max-h-[250px] overflow-y-auto custom-scrollbar">
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
                className={`flex items-center justify-between w-[calc(100%-8px)] mx-auto px-3 sm:px-4 py-2 sm:py-2.5 text-right text-[11px] sm:text-xs font-bold transition-all duration-200 rounded-xl cursor-pointer ${
                  isSelected 
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
  materialFilter,
  onMaterialChange,
  serviceFilter,
  onServiceChange,
  availableMaterials,
  availableServices,
  onResetFilters,
  hasActiveFilters
}) => {

  // Status filter options
  const statusOptions = [
    { id: 'all', label: 'كل الحالات' },
    { id: 'active', label: 'نشط' },
    { id: 'pendingadminapproval', label: 'قيد المراجعة' },
    { id: 'suspended', label: 'معلق' },
    { id: 'rejected', label: 'مرفوض' },
  ];

  // Rating sort options
  const ratingOptions = [
    { id: 'all', label: 'بدون ترتيب' },
    { id: 'desc', label: 'الأعلى تقييماً أولاً' },
    { id: 'asc', label: 'الأقل تقييماً أولاً' },
  ];

  // Build materials options dynamically
  const materialOptions = [
    { id: 'all', label: 'كل المواد والأجهزة' },
    ...availableMaterials.map(m => ({ id: m, label: m }))
  ];

  // Build services options dynamically
  const serviceOptions = [
    { id: 'all', label: 'كل الخدمات' },
    ...availableServices.map(s => ({ id: s, label: s }))
  ];

  return (
    <div className="w-full flex flex-col gap-3 relative z-10" dir="rtl">
      {/* Filter bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.75rem] p-3 sm:p-4 border border-slate-100 dark:border-slate-800/60 shadow-sm">
        
        {/* Filter label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <Filter size={13} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              تصفية وترتيب
            </span>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2.5 py-1.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <RotateCcw size={12} />
              إعادة تعيين
            </button>
          )}
        </div>

        {/* Filter dropdowns grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* Status Filter */}
          <FilterDropdown
            label="حالة المخبر"
            icon={FlaskConical}
            value={statusFilter}
            options={statusOptions}
            onChange={onStatusChange}
            colorKey="emerald"
          />

          {/* Rating Sort */}
          <FilterDropdown
            label="متوسط التقييم"
            icon={Star}
            value={ratingSort}
            options={ratingOptions}
            onChange={onRatingSortChange}
            colorKey="amber"
          />

          {/* Materials Filter */}
          <FilterDropdown
            label="المواد والأجهزة"
            icon={Wrench}
            value={materialFilter}
            options={materialOptions}
            onChange={onMaterialChange}
            colorKey="blue"
          />

          {/* Services Filter */}
          <FilterDropdown
            label="الخدمات"
            icon={Sparkles}
            value={serviceFilter}
            options={serviceOptions}
            onChange={onServiceChange}
            colorKey="violet"
          />
        </div>
      </div>
    </div>
  );
};

export default LabsFilter;
