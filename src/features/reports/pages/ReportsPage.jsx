import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReportsHeader from '../components/ReportsHeader';
import FinancialReportSection from '../components/FinancialReportSection';
import SubscriptionReportSection from '../components/SubscriptionReportSection';
import ReportsTable from '../components/ReportsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
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
    refetchAll,
    reports,
    pagination,
    setCurrentPage
  } = useReports(7);

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 bg-transparent" dir="rtl">
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

      {/* 1. قسم التقارير المالية المجمعة */}
      {(activeTab === 'all' || activeTab === 'financial') && (
        <section className="space-y-4">
          <FinancialReportSection
            financialData={financialData}
            isLoading={isFinancialLoading}
          />
        </section>
      )}

      {/* 2. قسم تقارير حالة الاشتراكات */}
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

      {/* 3. قسم السجلات والأرشيف التاريخي */}
      {(activeTab === 'all' || activeTab === 'archived') && (
        <section className="space-y-4 pt-4 border-t border-border-main/50">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-black text-text-main">{t('reports.archiveTitle')}</h3>
              <p className="text-xs text-text-muted">{t('reports.archiveDesc')}</p>
            </div>
          </div>
          
          <ReportsTable reports={reports} isLoading={isLoading} />

          <MembershipPagination
            pagination={pagination}
            onPageChange={setCurrentPage}
          />
        </section>
      )}
    </div>
  );
};

export default ReportsPage;
