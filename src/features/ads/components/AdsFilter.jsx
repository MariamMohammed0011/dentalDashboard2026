import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, RotateCcw, Filter, ShieldCheck, Activity, Users, X, Sparkles, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';

// 🎨 Presets للألوان والحدود الملونة التفاعلية لكل فلتر
const colorPresets = {
  blue: {
    border: 'border-blue-500/40 dark:border-blue-500/40 hover:border-blue-500',
    active: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 shadow-blue-500/10',
    icon: 'text-blue-500',
    selected: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-black',
    check: 'text-blue-500',
    ring: 'focus:ring-blue-500/20 focus:border-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  emerald: {
    border: 'border-emerald-500/40 dark:border-emerald-500/40 hover:border-emerald-500',
    active: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-emerald-500/10',
    icon: 'text-emerald-500',
    selected: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-black',
    check: 'text-emerald-500',
    ring: 'focus:ring-emerald-500/20 focus:border-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  amber: {
    border: 'border-amber-500/40 dark:border-amber-500/40 hover:border-amber-500',
    active: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 shadow-amber-500/10',
    icon: 'text-amber-500',
    selected: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-black',
    check: 'text-amber-500',
    ring: 'focus:ring-amber-500/20 focus:border-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  violet: {
    border: 'border-violet-500/40 dark:border-violet-500/40 hover:border-violet-500',
    active: 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-50/60 dark:bg-violet-950/30 shadow-violet-500/10',
    icon: 'text-violet-500',
    selected: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-black',
    check: 'text-violet-500',
    ring: 'focus:ring-violet-500/20 focus:border-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  },
};

const CustomSelect = ({ label, icon: Icon, value, options, onChange, colorKey = 'blue' }) => {
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

  const selectedOption = options.find((o) => o.id === value);
  const currentLabel = selectedOption ? selectedOption.label : label;
  const isFiltered = value !== 'all' && value !== '';

  return (
    <div className={`flex flex-col gap-2 text-right relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <label className="text-[11px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1">
        {Icon && <Icon size={14} className={colors.icon} />}
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full bg-gray-50/80 dark:bg-slate-900/80 font-bold text-xs sm:text-sm rounded-2xl px-4 py-2.5 border-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring} transition-all duration-300 cursor-pointer ${
          isFiltered ? colors.active : `${colors.border} text-text-main`
        }`}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full right-0 mt-2 w-full min-w-[200px] bg-white dark:bg-slate-900 border-2 ${colors.border} rounded-2xl shadow-2xl py-2 z-[100] max-h-[260px] overflow-y-auto custom-scrollbar`}
          >
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
                  className={`flex items-center justify-between w-[calc(100%-12px)] mx-auto px-3.5 py-2.5 my-0.5 text-right text-xs sm:text-sm font-bold transition-all duration-200 rounded-xl cursor-pointer ${
                    isSelected
                      ? colors.selected
                      : 'text-text-main hover:bg-gray-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={16} className={colors.check} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdsFilter = ({ filters, onApplyFilters, onResetFilters }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState(filters.approvalStatus || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all');

  useEffect(() => {
    setSearchQuery(filters.search || '');
    setApprovalStatusFilter(filters.approvalStatus || 'all');
    setStatusFilter(filters.status || 'all');
    setTypeFilter(filters.type || 'all');
  }, [filters]);

  const approvalStatusOptions = [
    { id: 'all', label: t('ads.adsFilter.allStatuses') },
    { id: 'pending', label: t('ads.adsFilter.statusPending') },
    { id: 'approved', label: t('ads.adsFilter.statusApproved') },
    { id: 'rejected', label: t('ads.adsFilter.statusRejected') },
  ];

  const statusOptions = [
    { id: 'all', label: t('ads.adsFilter.allStatuses') },
    { id: 'active', label: t('ads.adsFilter.activeStatus') },
    { id: 'inactive', label: t('ads.adsFilter.inactiveStatus') },
  ];

  const typeOptions = [
    { id: 'all', label: t('ads.adsFilter.allAudiences') },
    { id: 'dentists', label: t('ads.adsFilter.audienceDentistsEmoji') },
    { id: 'labs', label: t('ads.adsFilter.audienceLabsEmoji') },
    { id: 'both', label: t('ads.adsFilter.audienceBothEmoji') },
  ];

  const activeFiltersCount = [
    searchQuery.trim() !== '',
    approvalStatusFilter !== 'all',
    statusFilter !== 'all',
    typeFilter !== 'all',
  ].filter(Boolean).length;

  const handleApply = () => {
    onApplyFilters({
      search: searchQuery,
      approvalStatus: approvalStatusFilter,
      status: statusFilter,
      type: typeFilter,
    });
    toast.success(t('ads.adsFilter.applySuccess'));
  };

  const handleReset = () => {
    setSearchQuery('');
    setApprovalStatusFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    onResetFilters();
    toast.info(t('ads.adsFilter.resetSuccess'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-bg-card border border-border-main/70 rounded-[2rem] p-5 sm:p-6 shadow-sm shadow-slate-100/50 dark:shadow-none flex flex-col gap-5 relative z-30 transition-all duration-300"
    >
     
      <div className="flex items-center justify-between pb-3 border-b border-border-main/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <SlidersHorizontal size={18} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-text-main">{t('ads.adsFilter.title')}</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Sparkles size={11} />
                <span>{activeFiltersCount} {t('ads.adsFilter.activeSuffix')}</span>
              </span>
            )}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-text-muted hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{t('ads.adsFilter.clearAll')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
       
        <CustomSelect
          label={t('ads.adsFilter.approvalStatusLabel')}
          icon={ShieldCheck}
          value={approvalStatusFilter}
          options={approvalStatusOptions}
          onChange={setApprovalStatusFilter}
          colorKey="blue"
        />


        <CustomSelect
          label={t('ads.adsFilter.statusLabel')}
          icon={Activity}
          value={statusFilter}
          options={statusOptions}
          onChange={setStatusFilter}
          colorKey="emerald"
        />


        <CustomSelect
          label={t('ads.addAdForUserModal.audienceLabel')}
          icon={Users}
          value={typeFilter}
          options={typeOptions}
          onChange={setTypeFilter}
          colorKey="amber"
        />


        <div className="flex flex-col gap-2 text-right">
          <label className="text-[11px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Search size={14} className="text-violet-500" />
            {t('ads.adsFilter.searchLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={t('ads.adsFilter.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              className="bg-gray-50/80 dark:bg-slate-900/80 border-2 border-violet-500/40 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl px-4 py-2.5 text-text-main font-bold text-xs sm:text-sm transition-all w-full pr-10 pl-8"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-violet-500" size={17} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

     
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleApply}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Filter size={16} />
            <span>{t('ads.adsFilter.applyButton')}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 dark:bg-slate-800/80 border border-border-main/50 text-text-muted hover:text-text-main hover:bg-gray-200 dark:hover:bg-slate-700 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>{t('ads.adsFilter.resetButton')}</span>
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <span className="text-xs font-medium text-text-muted hidden sm:inline-block">
            {t('ads.adsFilter.activeFiltersHint')}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AdsFilter;


