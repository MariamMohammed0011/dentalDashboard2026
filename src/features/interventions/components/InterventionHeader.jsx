import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshCw,
  Filter,
  Clock,
  ShieldCheck,
  Layers,
  ShieldAlert,
  FlaskConical,
  MessageSquareWarning
} from 'lucide-react';

const InterventionHeader = ({
  activeTab,
  onTabChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing,
  totalCount
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'all', label: t('interventions.tabs.all'), icon: Layers, color: 'text-primary' },
    { id: 'admin', label: t('interventions.tabs.admin'), icon: ShieldAlert, color: 'text-amber-500' },
    { id: 'lab', label: t('interventions.tabs.lab'), icon: FlaskConical, color: 'text-sky-500' },
  ];

  const statusFilters = [
    { id: 'all', label: t('interventions.statusFilter.all'), icon: Filter, color: 'text-indigo-500' },
    { id: 'pending', label: t('interventions.statusFilter.pending'), icon: Clock, color: 'text-amber-500' },
    { id: 'replied', label: t('interventions.statusFilter.replied'), icon: ShieldCheck, color: 'text-emerald-500' },
  ];

  return (
    <div className="flex flex-col gap-5 w-full mb-2 font-zain select-none" dir="rtl">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-2 sm:pb-3 border-b border-border-main/40">
        <div className="flex items-center gap-2.5 sm:gap-4 w-full">
          <div className="p-2 sm:p-3.5 bg-primary/10 text-primary rounded-lg sm:rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center shrink-0">
            <MessageSquareWarning size={18} className="sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="text-right min-w-0 flex-1">
            <h1 className="text-lg sm:text-3xl font-bold text-text-main tracking-tight break-words">
             {t('interventions.headerTitle')}
            </h1>
          </div>
        </div>


      </div>

      {/* Filter Controls Section (Stacked full-width rows like Notifications page) */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full font-zain">

        {/* 1. Target Destination Filter (Full Row) */}
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
          <label className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 mr-1">
            <Layers size={13} className="sm:w-4 sm:h-4 text-sky-500 shrink-0" />
            <span>تصفية الجهة:</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 sm:p-1.5 rounded-lg sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap min-h-7 sm:min-h-9 ${
                    isActive
                      ? 'bg-sky-500 text-white font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={13} className={`sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Status Filter (Full Row) */}
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
          <label className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 mr-1">
            <Filter size={13} className="sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span>تصفية الحالة:</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 sm:p-1.5 rounded-lg sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs w-full">
            {statusFilters.map((f) => {
              const Icon = f.icon;
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onStatusFilterChange(f.id)}
                  className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap min-h-7 sm:min-h-9 ${
                    isActive
                      ? 'bg-sky-500 text-white font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={13} className={`sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : f.color}`} />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default InterventionHeader;