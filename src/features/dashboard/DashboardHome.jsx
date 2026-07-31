import React from 'react';
import { Pie, Column, Line, Area } from '@ant-design/plots';
import WelcomeHeader from './components/WelcomeHeader';
import { useTheme } from '../../context/ThemeContext';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import {
  Users,
  FlaskConical,
  Activity,
  TrendingUp,
  DollarSign,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color, borderAccent, progressPercentage, progressColor, subDetails }) => (
  <div className="group relative bg-bg-card border border-primary/30 hover:border-primary rounded-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between h-full text-right overflow-hidden" dir="rtl">
    {/* Accent Top Bar */}
    <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${borderAccent} opacity-100 transition-opacity`} />
    
    {/* Decorative Ambient Glow */}
    <div className={`absolute -bottom-8 -left-8 w-28 h-28 rounded-full ${color} opacity-[0.08] group-hover:opacity-[0.16] blur-xl transition-all duration-500 pointer-events-none`} />

    <div className="flex flex-col justify-between flex-1">
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex flex-col items-start gap-1 text-right min-w-0 flex-1">
          <h3 className="text-text-muted font-bold text-xs sm:text-sm tracking-wide truncate w-full" title={title}>
            {title}
          </h3>
          <span className="text-3xl sm:text-4xl font-black text-text-main tracking-tight group-hover:scale-105 transition-transform origin-right leading-none py-1">
            {count}
          </span>
        </div>
        <div className={`p-3 sm:p-3.5 rounded-2xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
          <Icon size={24} className="shrink-0" />
        </div>
      </div>

      <div className="my-3">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className={`h-full ${progressColor || 'bg-blue-500'} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage ?? 0))}%` }}
          />
        </div>
      </div>
    </div>

    <div className="border-t border-border-main/50 pt-3.5 mt-auto flex flex-col gap-2 w-full">
      {subDetails}
    </div>
  </div>
);

export default function DashboardHome() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const {
    dentistsOrdersData,
    labsOrdersData,
    financialGrowthData,
    ratingsChartData,
    compensationsChartData,
    statusChartData,
    kpiStats,
    isLoading,
    isError,
    getPeriodText
  } = useDashboardStats();

  // 1. مخطط طلبات الأطباء (Grouped Side-by-Side Column Chart)
  const dentistsColumnConfig = {
    data: dentistsOrdersData,
    xField: 'displayName',
    yField: 'totalOrders',
    colorField: 'displayName',
    color: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#6366F1', '#34D399'],
    legend: false,
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      maxWidth: 36,
      radiusTopLeft: 8,
      radiusTopRight: 8,
    },
    label: {
      text: 'totalOrders',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        dy: -8,
        fill: theme === 'dark' ? '#f8fafc' : '#1f2937',
      },
    },
    axis: {
      x: {
        labelAutoRotate: false,
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
      y: {
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
    },
  };

  // 2. مخطط طلبات المختبرات (Grouped Side-by-Side Column Chart)
  const labsColumnConfig = {
    data: labsOrdersData,
    xField: 'displayName',
    yField: 'totalOrders',
    colorField: 'displayName',
    color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#6366F1', '#34D399'],
    legend: false,
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      maxWidth: 36,
      radiusTopLeft: 8,
      radiusTopRight: 8,
    },
    label: {
      text: 'totalOrders',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        dy: -8,
        fill: theme === 'dark' ? '#f8fafc' : '#1f2937',
      },
    },
    axis: {
      x: {
        labelAutoRotate: false,
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
      y: {
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
    },
  };

  // خريطة ألوان مخصصة لكل حالة من حالات الطلبات (Enums)
  const statusColorMap = {
    Pennding: '#F59E0B',
    Pending: '#F59E0B',
    Accepted: '#3B82F6',
    RequestInfo: '#6366F1',
    InDesign: '#8B5CF6',
    InProduction: '#06B6D4',
    InColoring: '#EC4899',
    Ready: '#10B981',
    Delivered: '#059669',
    WaitingForClarification: '#F97316',
    Cancelled: '#EF4444',

    'قيد الانتظار': '#F59E0B',
    'مقبولة': '#3B82F6',
    'طلب معلومات': '#6366F1',
    'قيد التصميم': '#8B5CF6',
    'قيد الإنتاج': '#06B6D4',
    'قيد التلوين': '#EC4899',
    'جاهزة': '#10B981',
    'تم التسليم': '#059669',
    'بانتظار توضيح': '#F97316',
    'ملغاة': '#EF4444',
  };

  // 3. مخطط دورة حياة الطلبات (Pie Chart)
  const lifecycleConfig = {
    data: statusChartData || [],
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    radius: 0.8,
    scale: {
      color: {
        domain: (statusChartData || []).map(item => item.type),
        range: (statusChartData || []).map(item => statusColorMap[item.type] || statusColorMap[item.rawStatus] || '#3B82F6'),
      },
    },
    style: {
      fill: (d) => statusColorMap[d?.type] || statusColorMap[d?.rawStatus] || '#3B82F6',
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: false,
    label: {
      text: 'value',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        fill: theme === 'dark' ? '#ffffff' : '#1f2937',
      },
    },
    tooltip: {
      title: 'type',
      items: ['value'],
    },
  };

  // 4. مخطط اتجاهات مواد التعويضات (مربوط تماماً ببيانات الـ API)
  const trendsConfig = {
    data: compensationsChartData || [],
    xField: 'material',
    yField: 'count',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#3b82f6' : '#367AFF',
      radiusTopLeft: 8,
      radiusTopRight: 8,
      maxWidth: 48,
    },
    label: {
      text: 'count',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        dy: -8,
        fill: theme === 'dark' ? '#f8fafc' : '#1f2937',
      },
    },
    axis: {
      x: {
        labelAutoRotate: false,
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
      y: {
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
    },
  };

  // 5. مخطط تقييم أداء المخابر (Line Chart)
  const labConfig = {
    data: ratingsChartData || [],
    xField: 'lab',
    yField: 'value',
    colorField: 'metric',
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    scale: {
      color: {
        range: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      },
    },
    style: {
      lineWidth: 3,
    },
    point: {
      shapeField: 'circle',
      sizeField: 5,
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: false,
    axis: {
      x: {
        labelAutoRotate: false,
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
      y: {
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
    },
  };

  // 6. مخطط الإيرادات والنمو المالي (Area Chart)
  const revenueConfig = {
    data: financialGrowthData || [],
    xField: 'month',
    yField: 'value',
    colorField: 'type',
    color: ['#8B5CF6', '#3B82F6'],
    stack: true,
    scale: {
      color: {
        range: ['#8B5CF6', '#3B82F6'],
      },
    },
    style: {
      fillOpacity: 0.6,
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: false,
    axis: {
      x: {
        labelAutoRotate: false,
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
      y: {
        labelFontSize: 11,
        labelFontWeight: 'bold',
        labelFill: theme === 'dark' ? '#cbd5e1' : '#334155',
      },
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-8 text-right" dir="rtl">
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-bg-card border border-border-main rounded-[2rem] p-6 h-48 w-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-2/3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-1/2"></div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="border-t border-border-main/50 pt-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title={t('dashboard.totalDoctors')}
            count={kpiStats.doctors.total}
            icon={Users}
            color="bg-blue-500 text-blue-500"
            borderAccent="from-blue-600 via-indigo-500 to-sky-400"
            progressPercentage={kpiStats.doctors.total > 0 ? Math.round((kpiStats.doctors.active / kpiStats.doctors.total) * 100) : 0}
            progressColor="bg-gradient-to-r from-emerald-500 to-blue-500"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{t('dashboard.activeAccounts')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{kpiStats.doctors.active} </span>
                  
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>{t('dashboard.pendingVerificationSyndicate')}</span>
                  </div>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{kpiStats.doctors.pending} </span>
                </div>
              </>
            }
          />

          <StatCard
            title={t('dashboard.totalLabs')}
            count={kpiStats.labs.total}
            icon={FlaskConical}
            color="bg-emerald-500 text-emerald-500"
            borderAccent="from-emerald-600 via-teal-500 to-green-400"
            progressPercentage={kpiStats.labs.total > 0 ? Math.round((kpiStats.labs.active / kpiStats.labs.total) * 100) : 0}
            progressColor="bg-gradient-to-r from-emerald-500 to-teal-400"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{t('dashboard.activeSubscribedLabs')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{kpiStats.labs.active} </span>
                  
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                    <span>{t('dashboard.disactivesubscriblab')}</span>
                  </div>
                  <span className="font-bold text-text-muted">{kpiStats.labs.suspended} </span>
                </div>
              </>
            }
          />

          <StatCard
            title={t('dashboard.activeCases')}
            count={kpiStats.cases.total}
            icon={Activity}
            color="bg-amber-500 text-amber-500"
            borderAccent="from-amber-500 via-orange-500 to-yellow-400"
            progressPercentage={kpiStats.cases.total > 0 ? Math.round((kpiStats.cases.inProgress / kpiStats.cases.total) * 100) : 0}
            progressColor="bg-gradient-to-r from-amber-500 to-orange-400"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span>{t('dashboard.inProgressLabs')}</span>
                  </div>
                  <span className="font-bold text-primary">{kpiStats.cases.inProgress} حالة</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <span>{t('dashboard.waitingScannerDelivery')}</span>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{kpiStats.cases.waitingScanner} حالة</span>
                </div>
              </>
            }
          />

          <StatCard
            title={t('dashboard.monthlyRevenue')}
            count={"$" + kpiStats.revenue.total.toLocaleString()}
            icon={DollarSign}
            color="bg-violet-500 text-violet-500"
            borderAccent="from-violet-600 via-purple-500 to-fuchsia-400"
            progressPercentage={kpiStats.revenue.total > 0 ? Math.round((kpiStats.revenue.subscriptions / kpiStats.revenue.total) * 100) : 0}
            progressColor="bg-gradient-to-r from-violet-500 to-purple-400"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                    <span>{t('dashboard.labSubscriptionsLabel')}</span>
                  </div>
                  <span className="font-bold text-text-main">${kpiStats.revenue.subscriptions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <span>{t('dashboard.adSpacesRevenue')}</span>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">${kpiStats.revenue.ads.toLocaleString()}</span>
                </div>
              </>
            }
          />
        </div>
      )}

      {/* صف المخططات الأول (الأطباء والمخابر) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className=" p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.dentistsOrders')} {getPeriodText(dentistsOrdersData)}</h3>
              <p className="text-xs text-text-muted">{t('dashboard.dentistsOrdersDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-violet-500 bg-violet-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>{t('dashboard.highActivity')}</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm text-text-muted">{t('common.loading')}</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 text-red-500">
                <AlertTriangle size={32} />
                <span className="text-sm">{t('dashboard.failedLoadDoctorsStats')}</span>
              </div>
            ) : dentistsOrdersData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Column {...dentistsColumnConfig} />
              </div>
            )}
          </div>
        </div>

        <div className=" p-4 sm:p-6  flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.labsOrders')} {getPeriodText(labsOrdersData)}</h3>
              <p className="text-xs text-text-muted">{t('dashboard.labsOrdersDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>{t('dashboard.highProductivity')}</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm text-text-muted">{t('common.loading')}</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 text-red-500">
                <AlertTriangle size={32} />
                <span className="text-sm">{t('dashboard.failedLoadLabsStats')}</span>
              </div>
            ) : labsOrdersData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Column {...labsColumnConfig} />
              </div>
            )}
          </div>
        </div>

      </div> 

      {/* صف المخططات الثاني (اتجاهات مواد التعويضات ودورة الحياة) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

        <div className="lg:col-span-6  p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.marketTrends')}</h3>
              <p className="text-xs text-text-muted">{t('dashboard.marketTrendsDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>{t('dashboard.growing')}</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : compensationsChartData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Column {...trendsConfig} />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4   p-4 sm:p-6 flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.orderLifecycle')}</h3>
            <p className="text-xs text-text-muted">{t('dashboard.orderLifecycleDesc')}</p>
          </div>
          <div className="h-[250px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : statusChartData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Pie {...lifecycleConfig} />
              </div>
            )}
          </div>

          {/* Custom Styled Arabic Legend */}
          {statusChartData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-border-main/50 mt-2">
              {statusChartData.map((item) => {
                const color = statusColorMap[item.type] || statusColorMap[item.rawStatus] || '#3B82F6';
                return (
                  <div key={item.type} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-text-main">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span>{item.type}</span>
                    <span className="text-primary font-black dir-ltr mr-1">({item.value})</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* صف المخططات الثالث (أداء المخابر والتحليل المالي) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className=" p-4 sm:p-6 flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.labsPerformance')}</h3>
            <p className="text-xs text-text-muted">{t('dashboard.labsPerformanceDesc')}</p>
          </div>
          <div className="h-[250px] flex items-center justify-center mt-4">
            {isLoading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : ratingsChartData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Line {...labConfig} />
              </div>
            )}
          </div>
          {ratingsChartData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border-main/50 mt-2">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-text-main">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>التقييم العام</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-text-main">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>تقييم الجودة</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-text-main">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>الالتزام بالوقت</span>
              </div>
            </div>
          )}
        </div>

        <div className=" p-4 sm:p-6 flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.financialAnalysis')}</h3>
            <p className="text-xs text-text-muted">{t('dashboard.financialAnalysisDesc')}</p>
          </div>
          <div className="h-[250px] flex items-center justify-center mt-4">
            {isLoading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : financialGrowthData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Area {...revenueConfig} />
              </div>
            )}
          </div>
          {financialGrowthData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border-main/50 mt-2">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-text-main">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span>عوائد المساحات الإعلانية ($)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-text-main">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>أرباح الطلبيات ($)</span>
              </div>
            </div>
          )}
        </div>

      </div> 

    </div>
  );
}