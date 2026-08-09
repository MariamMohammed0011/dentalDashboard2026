import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import FinancialReportSection from '../components/FinancialReportSection';
import SubscriptionReportSection from '../components/SubscriptionReportSection';
import { useReports } from '../hooks/useReports';
import { AlertCircle, RefreshCw, TrendingUp, FlaskConical } from 'lucide-react';

const ReportsPage = ({ defaultTab }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // تحديد التاب الحالي بناءً على الـ Prop أو عنوان الصفحة
  const isSubscriptions = defaultTab === 'subscriptions' || location.pathname.includes('/subscriptions');
  const [days, setDays] = useState(7);

  const {
    financialData,
    isFinancialLoading,
    subscriptionData,
    isSubscriptionLoading,
    isError,
    
  } = useReports(days);

  return (
    <div className="p-2 sm:p-4 flex flex-col gap-6 bg-transparent font-zain" dir="rtl">
     

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

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSubscriptions ? 'subscriptions-view' : 'financial-view'}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-8"
        >
          {isSubscriptions ? (
            /* قسم تقارير حالة الاشتراكات المستقل */
            <section className="space-y-4">
              <SubscriptionReportSection
                subscriptionData={subscriptionData}
                isLoading={isSubscriptionLoading}
                days={days}
                setDays={setDays}
              />
            </section>
          ) : (
            /* قسم التقارير المالية المستقل */
            <section className="space-y-4">
              <FinancialReportSection
                financialData={financialData}
                isLoading={isFinancialLoading}
              />
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
