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
      
      {/* 1. Header Title & Refresh Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-border-main/40">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm shrink-0">
              <MessageSquareWarning size={22} className="text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight font-zain">
              {t('interventions.headerTitle')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('interventions.registeredCount', { count: totalCount })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-medium font-zain">
            {t('interventions.subtitle')}
          </p>
        </div>

       
      </div>

      {/* 2. Responsive Controls Grid (No Scroll Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-2 bg-bg-card/60 dark:bg-slate-900/40 rounded-3xl border border-border-main/60 backdrop-blur-xl">
        
        {/* Section 1: Destination Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
          <span className="text-[11px] font-black text-text-muted px-2 hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap">
            <Layers size={14} className="text-primary" />
            الجهة:
          </span>
          <div className="grid grid-cols-3 gap-1 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition-all duration-200 text-center cursor-pointer ${
                    isActive
                      ? 'text-white bg-primary shadow-md shadow-primary/20 scale-[1.02]'
                      : 'text-text-muted hover:text-text-main hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : tab.color} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Status Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
          <span className="text-[11px] font-black text-text-muted px-2 hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap">
            الحالة:
          </span>
          <div className="grid grid-cols-3 gap-1 w-full">
            {statusFilters.map((f) => {
              const Icon = f.icon;
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onStatusFilterChange(f.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition-all duration-200 text-center cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md shadow-slate-900/10 scale-[1.02]'
                      : 'text-text-muted hover:text-text-main hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={14} className={isActive ? (f.id === 'pending' ? 'text-amber-400' : f.id === 'replied' ? 'text-emerald-400' : 'text-indigo-400') : f.color} />
                  <span className="truncate">{f.label}</span>
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