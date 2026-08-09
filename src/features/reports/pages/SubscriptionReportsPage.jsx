import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import SubscriptionReportSection from '../components/SubscriptionReportSection';
import { useReports } from '../hooks/useReports';

const SubscriptionReportsPage = () => {
  const { t } = useTranslation();
  const {
    subscriptionData,
    isSubscriptionLoading,
    days,
    setDays,
    isError,
  } = useReports(7);

  return (
    <div 
      className="w-full max-w-full overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8 flex flex-col gap-4 sm:gap-6 bg-transparent font-zain select-none" 
      dir="rtl"
    >
      {/* Error Banner */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-xs sm:text-sm font-bold backdrop-blur-md"
        >
          <AlertCircle size={18} className="shrink-0 text-rose-500" />
          <span>{t('common.errorOccurred')}</span>
        </motion.div>
      )}

      {/* Subscription Report Section */}
      <div className="w-full overflow-hidden">
        <SubscriptionReportSection
          subscriptionData={subscriptionData}
          isLoading={isSubscriptionLoading}
          days={days}
          setDays={setDays}
        />
      </div>
    </div>
  );
};

export default SubscriptionReportsPage;