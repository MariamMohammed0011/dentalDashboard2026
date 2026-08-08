import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, BarChart3, DollarSign, CreditCard, LayoutGrid, Table } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportsHeader = ({
  activeTab,
  setActiveTab,
  
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'all', label: t('reports.tabs.all'), icon: BarChart3 },
    { id: 'financial', label: t('reports.tabs.financial'), icon: DollarSign },
    { id: 'subscriptions', label: t('reports.tabs.subscriptions'), icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-4 w-full mb-6 font-zain" dir="rtl">
      {/* Top Bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-zain text-text-main tracking-tight">
            {t('reports.headerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-zain mt-1 font-medium">
            {t('reports.subtitle')}
          </p>
        </div>

    
      </div>

      {/* Tabs Row */}
      <div className="flex  items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-border-main/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex  items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-bg-card text-text-muted hover:text-text-main border border-border-main/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={16} />
              <span className='font-zain'>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsHeader;

