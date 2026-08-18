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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-border-main/40">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm shrink-0">
              < size={22} className="text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight font-zain">
             
            </h1> */}
            <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center">
            <MessageSquareWarning size={20} className="text-primary" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
             {t('interventions.headerTitle')}
            </h1>
            
          </div>
        </div>
            {/* <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('interventions.registeredCount', { count: totalCount })}
            </span> */}
          </div>
          {/* <p className="text-xs sm:text-sm text-text-muted mt-1 font-medium font-zain">
            {t('interventions.subtitle')}
          </p> */}
        </div>


      </div>

      {/* Filter Controls Section (Stacked full-width rows like Notifications page) */}
      <div className="flex flex-col gap-4 w-full font-zain">

        {/* 1. Target Destination Filter (Full Row) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Layers size={15} className="text-sky-500" />
            <span>تصفية حسب الجهة الموجه إليها:</span>
          </label>
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-500 text-white font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : tab.color} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Status Filter (Full Row) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Filter size={15} className="text-amber-500" />
            <span>تصفية حسب حالة الشكوى:</span>
          </label>
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs w-full">
            {statusFilters.map((f) => {
              const Icon = f.icon;
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onStatusFilterChange(f.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-500 text-white font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : f.color} />
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