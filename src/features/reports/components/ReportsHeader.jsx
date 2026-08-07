import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, BarChart3, DollarSign, CreditCard, FileText } from 'lucide-react';

const ReportsHeader = ({ activeTab, setActiveTab, onRefresh, isRefreshing }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'all', label: t('reports.tabs.all'), icon: BarChart3 },
    { id: 'financial', label: t('reports.tabs.financial'), icon: DollarSign },
    { id: 'subscriptions', label: t('reports.tabs.subscriptions'), icon: CreditCard },
    { id: 'archived', label: t('reports.tabs.archived'), icon: FileText },
  ];

  return (
    <div className="flex flex-col gap-4 w-full mb-6" dir="rtl">
      {/* Top Bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
            {t('reports.headerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {t('reports.subtitle')}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-bg-card border border-border-main text-text-main font-bold text-xs sm:text-sm shadow-sm hover:border-primary/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-primary' : 'text-text-muted'} />
          <span>{isRefreshing ? t('common.refreshing') : t('common.refresh')}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-border-main/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-bg-card text-text-muted hover:text-text-main border border-border-main/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsHeader;
