import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReportsHeader from '../components/ReportsHeader';
import FinancialReportSection from '../components/FinancialReportSection';
import SubscriptionReportSection from '../components/SubscriptionReportSection';
import ReportsTableView from '../components/ReportsTableView';
import { useReports } from '../hooks/useReports';
import { AlertCircle } from 'lucide-react';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const {
    financialData,
    isFinancialLoading,
    subscriptionData,
    isSubscriptionLoading,
    days,
    setDays,
    isLoading,
    isError,
    refetchAll,
  } = useReports(7);

  return (
    <div className="p-2 sm:p-4 flex flex-col gap-8 bg-transparent font-zain" dir="rtl">
      {/* Top Navigation & Controls Header with View Switcher */}
      <ReportsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={refetchAll}
        isRefreshing={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm font-bold"
        >
          <AlertCircle size={20} className="shrink-0" />
          <span>{t('common.errorOccurred')}</span>
        </motion.div>
      )}

      {/* Main Content with Animated View Switching */}
      <AnimatePresence mode="wait">
       
        
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            {/* 1. قسم التقارير المالية المجمعة (مربوط بالباك إند) */}
            {(activeTab === 'all' || activeTab === 'financial') && (
              <section className="space-y-4">
                <FinancialReportSection
                  financialData={financialData}
                  isLoading={isFinancialLoading}
                />
              </section>
            )}

            {/* 2. قسم تقارير حالة الاشتراكات (مربوط بالباك إند) */}
            {(activeTab === 'all' || activeTab === 'subscriptions') && (
              <section className="space-y-4 pt-4 border-t border-border-main/50">
                <SubscriptionReportSection
                  subscriptionData={subscriptionData}
                  isLoading={isSubscriptionLoading}
                  days={days}
                  setDays={setDays}
                />
              </section>
            )}
          </motion.div>
        
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
