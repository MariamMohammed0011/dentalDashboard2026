import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RefreshCw, Filter, Clock, ShieldCheck } from 'lucide-react';

const InterventionHeader = ({
  activeTab,
  onTabChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
  totalCount
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'all', label: t('interventions.tabs.all') },
    { id: 'admin', label: t('interventions.tabs.admin') },
    { id: 'lab', label: t('interventions.tabs.lab') },
  ];

  const statusFilters = [
    { id: 'all', label: t('interventions.statusFilter.all') },
    { id: 'pending', label: t('interventions.statusFilter.pending'), icon: Clock },
    { id: 'replied', label: t('interventions.statusFilter.replied'), icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col gap-5 w-full mb-4" dir="rtl">
      {/* Top Title & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
              {t('interventions.headerTitle')}
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {t('interventions.registeredCount', { count: totalCount })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {t('interventions.subtitle')}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-bg-card border border-border-main text-text-main font-bold text-xs sm:text-sm shadow-sm hover:border-primary/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-primary' : 'text-text-muted'} />
          <span>{isRefreshing ? t('common.refreshing') : t('interventions.refreshComplaints')}</span>
        </button>
      </div>

      {/* Controls Row: Search + Destination Tabs + Status Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-bg-card p-3 rounded-[2rem] border border-border-main shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('interventions.searchPlaceholder')}
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Destination Tabs (All / Admin / Lab) */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter Pills (All / Pending / Replied) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <Filter size={14} className="text-text-muted mr-1.5 ml-0.5" />
          {statusFilters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => onStatusFilterChange(f.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.id
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {Icon && <Icon size={12} />}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterventionHeader;