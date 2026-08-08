import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReportsHeader from '../components/ReportsHeader';
import FinancialReportSection from '../components/FinancialReportSection';
import SubscriptionReportSection from '../components/SubscriptionReportSection';
import { useReports } from '../hooks/useReports';
import { AlertCircle } from 'lucide-react';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const {
    financialData,
    isFinancialLoading,
    subscriptionData,
    isSubscriptionLoading,
    days,
    setDays,
    isLoading,
    isError,
    refetchAll
  } = useReports(7);

  return (
    <div className="p-2 sm:p-4 flex flex-col gap-8 bg-transparent" dir="rtl">
      {/* Top Navigation & Controls Header */}
      <ReportsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={refetchAll}
        isRefreshing={isLoading}
      />

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm font-bold">
          <AlertCircle size={20} className="shrink-0" />
          <span>{t('common.errorOccurred')}</span>
        </div>
      )}

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
    </div>
  );
};

export default ReportsPage;

