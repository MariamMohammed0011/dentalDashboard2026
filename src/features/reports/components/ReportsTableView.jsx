import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  DollarSign,
  CreditCard,
  Megaphone,
  FlaskConical,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Clock,
  Download,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AnimatedNumber from '../../../components/shared/AnimatedNumber';

export default function ReportsTableView({
  financialData,
  subscriptionData,
  days,
  activeTab = 'all',
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    paidAdsTotalRevenue = 0,
    paidAdsCount = 0,
    activeSubscriptionsTotalRevenue = 0,
    activeSubscriptionsCount = 0,
    totalOverallRevenue = 0,
  } = financialData || {};

  const subRevenue = Number(activeSubscriptionsTotalRevenue) || 0;
  const adRevenue = Number(paidAdsTotalRevenue) || 0;
  const totalRev = Number(totalOverallRevenue) || (subRevenue + adRevenue);

  const subPercent = totalRev > 0 ? Math.round((subRevenue / totalRev) * 100) : 0;
  const adPercent = totalRev > 0 ? Math.round((adRevenue / totalRev) * 100) : 0;

  const {
    expiringSoonLabs = [],
    statusDistribution = {
      activeLabsCount: 0,
      suspendedLabsCount: 0,
      totalLabsCount: 0,
      activePercentage: 0,
      suspendedPercentage: 0,
    },
    retentionStats = {
      totalSubscribedLabs: 0,
      renewedLabsCount: 0,
      retentionRatePercentage: 0,
    },
  } = subscriptionData || {};

  // Financial Rows Data
  const financialRows = [
    {
      id: 'sub',
      category: t('reports.financial.subscriptionsRevenue'),
      icon: CreditCard,
      color: 'emerald',
      revenue: subRevenue,
      percentage: subPercent,
      countLabel: t('reports.financial.activeCount', { count: activeSubscriptionsCount }),
      status: t('common.active'),
    },
    {
      id: 'ads',
      category: t('reports.financial.adsRevenue'),
      icon: Megaphone,
      color: 'purple',
      revenue: adRevenue,
      percentage: adPercent,
      countLabel: t('reports.financial.adsCount', { count: paidAdsCount }),
      status: t('common.active'),
    },
  ];

  // Subscriptions Rows Data
  const subscriptionRows = [
    {
      id: 'total',
      title: t('reports.subscriptionsReport.totalLabs'),
      icon: FlaskConical,
      color: 'blue',
      count: statusDistribution.totalLabsCount || 0,
      badge: '100%',
      desc: t('labs.title'),
    },
    {
      id: 'active',
      title: t('reports.subscriptionsReport.activeLabs'),
      icon: UserCheck,
      color: 'emerald',
      count: statusDistribution.activeLabsCount || 0,
      badge: `${statusDistribution.activePercentage || 0}%`,
      desc: t('common.active'),
    },
    {
      id: 'suspended',
      title: t('reports.subscriptionsReport.suspendedLabs'),
      icon: AlertCircle,
      color: 'rose',
      count: statusDistribution.suspendedLabsCount || 0,
      badge: `${statusDistribution.suspendedPercentage || 0}%`,
      desc: t('common.suspended'),
    },
    {
      id: 'retention',
      title: t('reports.subscriptionsReport.retentionRate'),
      icon: RefreshCw,
      color: 'purple',
      count: `${retentionStats.retentionRatePercentage || 0}%`,
      badge: `${retentionStats.renewedLabsCount} / ${retentionStats.totalSubscribedLabs}`,
      desc: t('subscription.renew'),
    },
  ];

  const filteredExpiringLabs = expiringSoonLabs.filter((lab) =>
    (lab.labName || lab.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 font-zain"
      dir="rtl"
    >
      {/* 🔍 Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-bg-card p-4 rounded-3xl border border-border-main/70 shadow-sm">
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في التقارير والمخابر..."
            className="w-full pl-4 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-border-main/50 rounded-2xl text-xs font-bold text-text-main focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-muted bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl flex items-center gap-1.5 border border-border-main/50">
            <FileSpreadsheet size={16} className="text-emerald-500" />
            <span>عرض البيانات التفصيلية</span>
          </span>
        </div>
      </div>

      {/* 1. جدول التقارير المالية التفصيلي */}
      {(activeTab === 'all' || activeTab === 'financial') && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                <DollarSign size={20} />
              </div>
              <h3 className="text-lg font-black text-text-main">جدول الإيرادات والمداخيل المالية</h3>
            </div>
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              إجمالي المداخيل: <AnimatedNumber value={totalRev} prefix="$" decimals={2} />
            </div>
          </div>

          <div className="bg-white dark:bg-bg-card rounded-3xl border border-border-main/70 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-text-muted font-black border-b border-border-main/60">
                    <th className="py-4 px-4">مصدر الإيراد</th>
                    <th className="py-4 px-4">المبلغ الكلي</th>
                    <th className="py-4 px-4 text-center">نسبة المساهمة</th>
                    <th className="py-4 px-4">عدد العمليات / النشطة</th>
                    <th className="py-4 px-4 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/40 font-bold">
                  {financialRows.map((row, idx) => {
                    const IconComponent = row.icon;
                    return (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-4 font-black text-text-main flex items-center gap-3">
                          <div className={`p-2.5 rounded-2xl bg-${row.color}-500/10 text-${row.color}-500 border border-${row.color}-500/20 shrink-0`}>
                            <IconComponent size={18} />
                          </div>
                          <span>{row.category}</span>
                        </td>
                        <td className="py-4 px-4 text-base font-black text-text-main dir-ltr text-right">
                          <AnimatedNumber value={row.revenue} prefix="$" decimals={2} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-border-main/40">
                              <div
                                className={`h-full bg-${row.color}-500 rounded-full transition-all duration-700`}
                                style={{ width: `${row.percentage}%` }}
                              />
                            </div>
                            <span className="font-black text-text-muted">{row.percentage}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-text-muted">{row.countLabel}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black bg-${row.color}-500/10 text-${row.color}-600 dark:text-${row.color}-400 border border-${row.color}-500/20`}>
                            {row.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. جدول إحصائيات الاشتراك والمخابر */}
      {(activeTab === 'all' || activeTab === 'subscriptions') && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
                <FlaskConical size={20} />
              </div>
              <h3 className="text-lg font-black text-text-main">جدول ملخص حالات الاشتراكات</h3>
            </div>
            <span className="text-xs font-bold text-text-muted bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-border-main/50">
              النطاق الزمني: {days} يوم
            </span>
          </div>

          <div className="bg-white dark:bg-bg-card rounded-3xl border border-border-main/70 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-text-muted font-black border-b border-border-main/60">
                    <th className="py-4 px-4">مؤشر الاشتراك</th>
                    <th className="py-4 px-4 text-center">القيمة الإجمالية</th>
                    <th className="py-4 px-4 text-center">النسبة والتفاصيل</th>
                    <th className="py-4 px-4">الوصف والتصنيف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/40 font-bold">
                  {subscriptionRows.map((row, idx) => {
                    const IconComponent = row.icon;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 text-text-main font-black flex items-center gap-3">
                          <div className={`p-2.5 rounded-2xl bg-${row.color}-500/10 text-${row.color}-500 border border-${row.color}-500/20 shrink-0`}>
                            <IconComponent size={18} />
                          </div>
                          <span>{row.title}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-black text-text-main">
                          {typeof row.count === 'number' ? (
                            <AnimatedNumber value={row.count} />
                          ) : (
                            row.count
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-black bg-${row.color}-500/10 text-${row.color}-600 dark:text-${row.color}-400 border border-${row.color}-500/20`}>
                            {row.badge}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-text-muted">{row.desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* جدول المخابر القريبة من الانتهاء */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-black text-text-main px-1 flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <span>قائمة المخابر القريبة من الانتهاء خلال {days} أيام</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 mr-auto">
                {filteredExpiringLabs.length} مختبر
              </span>
            </h4>

            <div className="bg-white dark:bg-bg-card rounded-3xl border border-border-main/70 shadow-sm overflow-hidden">
              {filteredExpiringLabs.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                  <span className="text-sm font-black text-text-main">ممتاز! لا توجد اشتراكات قريبة من الانتهاء في النطاق المكرر.</span>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-text-muted font-black border-b border-border-main/60">
                        <th className="py-3 px-4">اسم المختبر</th>
                        <th className="py-3 px-4">تاريخ الانتهاء</th>
                        <th className="py-3 px-4 text-center">الأيام المتبقية</th>
                        <th className="py-3 px-4 text-center">الإجراء المتاح</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/40 font-bold">
                      {filteredExpiringLabs.map((lab, index) => (
                        <tr key={lab.id || index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 text-text-main font-black flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>{lab.labName || lab.name || `#${lab.id || index + 1}`}</span>
                          </td>
                          <td className="py-3 px-4 text-text-muted dir-ltr text-right">
                            {lab.expirationDate ? new Date(lab.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                              {lab.daysLeft ?? 0} يوم متبقي
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button type="button" className="text-xs font-bold text-primary hover:underline cursor-pointer">
                              {t('reports.subscriptionsReport.contactRenew')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
