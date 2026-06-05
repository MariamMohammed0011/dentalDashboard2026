import React from 'react';
import { Pie, Column, Line, Area, Bar } from '@ant-design/plots';
import WelcomeHeader from './components/WelcomeHeader';
import { useTheme } from '../../context/ThemeContext';
import { useDashboardStats } from './hooks/useDashboardStats';
import { 
  Users, 
  FlaskConical, 
  Activity, 
  TrendingUp, 
  DollarSign,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color, subDetails }) => (
  <div className="card bg-bg-card shadow-sm border border-border-main rounded-[2rem] p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-full relative overflow-hidden text-right" dir="rtl">
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-col items-start gap-1 text-right">
        <h3 className="text-text-muted font-bold text-sm sm:text-base">{title}</h3>
        <span className="text-3xl sm:text-4xl font-black text-text-main">{count}</span>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}>
        <Icon size={24} />
      </div>
    </div>
    
    <div className="border-t border-border-main/50 pt-3 mt-auto flex flex-col gap-1.5 w-full">
      {subDetails}
    </div>
  </div>
);

export default function DashboardHome() {
  const { theme } = useTheme();

  const {
    dentistsOrdersData,
    labsOrdersData,
    isLoading,
    isError,
    getPeriodText
  } = useDashboardStats();

  // إعدادات مخطط أعمدة الأطباء (Column Chart)
  const dentistsColumnConfig = {
    data: dentistsOrdersData,
    xField: 'displayName',
    yField: 'totalOrders',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#a78bfa' : '#8b5cf6',
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
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  // إعدادات مخطط أعمدة المخابر (Column Chart)
  const labsColumnConfig = {
    data: labsOrdersData,
    xField: 'displayName',
    yField: 'totalOrders',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#34d399' : '#10b981',
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
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  // 1. مخطط توزيع الحالات (Donut Chart)
  const lifecycleData = [
    { type: 'معلقة بانتظار القبول', value: 18 },
    { type: 'قيد التصنيع في المخابر', value: 34 },
    { type: 'بانتظار تسليم الماسح', value: 12 },
    { type: 'مكتملة ومسلمة', value: 45 },
    { type: 'ملغاة من الطبيب/المخبر', value: 8 },
  ];

  const lifecycleConfig = {
    data: lifecycleData,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    radius: 0.8,
    scale: {
      color: {
        range: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'],
      },
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: {
      color: {
        position: 'bottom',
        layout: 'horizontal',
        alignment: 'center',
        itemLabelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
        itemLabelFontSize: 11,
      },
    },
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

  // 2. مخطط اتجاهات مواد التعويضات (Column Chart)
  const trendsData = [
    { material: 'زيركون', count: 145 },
    { material: 'فينير', count: 82 },
    { material: 'كريستال', count: 64 },
    { material: 'بورسلان', count: 38 },
  ];

  const trendsConfig = {
    data: trendsData,
    xField: 'material',
    yField: 'count',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#3b82f6' : '#367AFF',
      radiusTopLeft: 8,
      radiusTopRight: 8,
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
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  // 3. مخطط أداء المخابر والالتزام بالمواعيد (Line Chart)
  const labData = [
    { lab: 'مخبر الفا', metric: 'معدل التأخير عن المواعيد (%)', value: 5 },
    { lab: 'مخبر الفا', metric: 'معدل رفض الطلبات (%)', value: 2 },
    { lab: 'مخبر السلام', metric: 'معدل التأخير عن المواعيد (%)', value: 12 },
    { lab: 'مخبر السلام', metric: 'معدل رفض الطلبات (%)', value: 8 },
    { lab: 'مخبر الابتسامة', metric: 'معدل التأخير عن المواعيد (%)', value: 4 },
    { lab: 'مخبر الابتسامة', metric: 'معدل رفض الطلبات (%)', value: 1 },
    { lab: 'مخبر النخبة', metric: 'معدل التأخير عن المواعيد (%)', value: 8 },
    { lab: 'مخبر النخبة', metric: 'معدل رفض الطلبات (%)', value: 3 },
    { lab: 'مخبر المستقبل', metric: 'معدل التأخير عن المواعيد (%)', value: 15 },
    { lab: 'مخبر المستقبل', metric: 'معدل رفض الطلبات (%)', value: 6 },
  ];

  const labConfig = {
    data: labData,
    xField: 'lab',
    yField: 'value',
    colorField: 'metric',
    point: {
      shapeField: 'circle',
      sizeField: 4,
    },
    scale: {
      color: {
        range: ['#EF4444', '#F59E0B'],
      },
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
    legend: {
      color: {
        position: 'bottom',
        itemLabelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  // 4. مخطط التحليل المالي والاشتراكات (Area Chart)
  const revenueData = [
    { month: 'ديسمبر', type: 'عوائد الإعلانات ($)', value: 1200 },
    { month: 'ديسمبر', type: 'اشتراكات المخابر ($)', value: 7500 },
    { month: 'يناير', type: 'عوائد الإعلانات ($)', value: 1500 },
    { month: 'يناير', type: 'اشتراكات المخابر ($)', value: 8000 },
    { month: 'فبراير', type: 'عوائد الإعلانات ($)', value: 1800 },
    { month: 'فبراير', type: 'اشتراكات المخابر ($)', value: 9200 },
    { month: 'مارس', type: 'عوائد الإعلانات ($)', value: 2100 },
    { month: 'مارس', type: 'اشتراكات المخابر ($)', value: 10500 },
    { month: 'أبريل', type: 'عوائد الإعلانات ($)', value: 2300 },
    { month: 'أبريل', type: 'اشتراكات المخابر ($)', value: 11800 },
    { month: 'مايو', type: 'عوائد الإعلانات ($)', value: 2400 },
    { month: 'مايو', type: 'اشتراكات المخابر ($)', value: 12840 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'value',
    colorField: 'type',
    stack: true,
    scale: {
      color: {
        range: ['#8B5CF6', '#3B82F6'],
      },
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
    legend: {
      color: {
        position: 'bottom',
        itemLabelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-8 text-right" dir="rtl">
      {/* هيدر الترحيب */}
      <WelcomeHeader 
        name="مى محمد" 
        role="SuperAdmin" 
        date="30 نيسان 2026" 
      />

      {/* 1. القسم العلوي: مؤشرات الأداء الحيوية (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* كارت الأطباء */}
        <StatCard 
          title="إجمالي الأطباء" 
          count="209" 
          icon={Users}
          color="bg-blue-500 text-blue-500"
          subDetails={
            <>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">حسابات نشطة:</span>
                <span className="font-bold text-green-500">185 طبيب</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">بانتظار التحقق (النقابة):</span>
                <span className="font-bold text-amber-500">24 حساب</span>
              </div>
            </>
          }
        />

        {/* كارت المخابر */}
        <StatCard 
          title="إجمالي المخابر" 
          count="42" 
          icon={FlaskConical}
          color="bg-emerald-500 text-emerald-500"
          subDetails={
            <>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">مخابر نشطة ومشتركة:</span>
                <span className="font-bold text-green-500">35 مخبر</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">حسابات معلقة/منتهية:</span>
                <span className="font-bold text-text-muted">7 مخابر</span>
              </div>
            </>
          }
        />

        {/* كارت الحالات النشطة */}
        <StatCard 
          title="الحالات النشطة (Active Cases)" 
          count="86" 
          icon={Activity}
          color="bg-amber-500 text-amber-500"
          subDetails={
            <>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">قيد التصنيع بالمخابر:</span>
                <span className="font-bold text-primary">58 حالة</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">بانتظار تسليم الماسح:</span>
                <span className="font-bold text-purple-500">28 حالة</span>
              </div>
            </>
          }
        />

        {/* كارت الأرباح الشهرية */}
        <StatCard 
          title="الأرباح الشهرية" 
          count="$15,240" 
          icon={DollarSign}
          color="bg-violet-500 text-violet-500"
          subDetails={
            <>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">اشتراكات المخابر:</span>
                <span className="font-bold text-text-main">$12,840</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">عوائد المساحات الإعلانية:</span>
                <span className="font-bold text-purple-500">$2,400</span>
              </div>
            </>
          }
        />

      </div>

      {/* قسم إحصائيات الطلبات الشهرية الفعلية (بيانات حقيقية) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* مخطط طلبات أطباء الأسنان */}
        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">طلبات أطباء الأسنان {getPeriodText(dentistsOrdersData)}</h3>
              <p className="text-xs text-text-muted">الأطباء الأكثر طلباً وتداولاً للحالات عبر المنصة</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-violet-500 bg-violet-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>نشاط مرتفع</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm text-text-muted">جاري تحميل البيانات...</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 text-red-500">
                <AlertTriangle size={32} />
                <span className="text-sm">فشل في تحميل إحصائيات الأطباء</span>
              </div>
            ) : dentistsOrdersData.length === 0 ? (
              <span className="text-sm text-text-muted">لا توجد بيانات متوفرة حالياً</span>
            ) : (
              <div className="w-full h-full">
                <Column {...dentistsColumnConfig} />
              </div>
            )}
          </div>
        </div>

        {/* مخطط طلبات المختبرات (المخابر) */}
        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">طلبات المختبرات {getPeriodText(labsOrdersData)}</h3>
              <p className="text-xs text-text-muted">المخابر الأكثر استقبالاً وتصنيعاً للحالات السنية</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>إنتاجية عالية</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm text-text-muted">جاري تحميل البيانات...</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 text-red-500">
                <AlertTriangle size={32} />
                <span className="text-sm">فشل في تحميل إحصائيات المختبرات</span>
              </div>
            ) : labsOrdersData.length === 0 ? (
              <span className="text-sm text-text-muted">لا توجد بيانات متوفرة حالياً</span>
            ) : (
              <div className="w-full h-full">
                <Column {...labsColumnConfig} />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 2. المخططات الرئيسية المقترحة وعرضها في الصفحة (Dashboard Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* مخطط اتجاهات مواد التعويضات (Column Chart) - 60% */}
        <div className="lg:col-span-6 bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">اتجاهات مواد التعويضات (Market Trends)</h3>
              <p className="text-xs text-text-muted">المواد الأكثر طلباً وتداولاً من قبل الأطباء عبر المنصة</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>نمو متزايد</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Column {...trendsConfig} />
          </div>
        </div>

        {/* مخطط توزيع الحالات (Donut Chart) - 40% */}
        <div className="lg:col-span-4 bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">دورة حياة الحالات (Order Lifecycle)</h3>
            <p className="text-xs text-text-muted">توزيع الطلبات الحالية في النظام بناءً على الحالة التشغيلية</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie {...lifecycleConfig} />
          </div>
        </div>

      </div>

      {/* الصف الثالث: مخطط أداء المخابر ومخطط التحليل المالي (50% و 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* مخطط أداء المخابر والالتزام بالمواعيد (Line Chart) */}
        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">أداء المخابر والالتزام بالمواعيد</h3>
            <p className="text-xs text-text-muted">مقارنة معدلات التأخر عن المواعيد النهائية (Deadlines) ومعدلات الرفض لأعلى المخابر حركة في النظام</p>
          </div>
          <div className="h-[300px] mt-6">
            <Line {...labConfig} />
          </div>
        </div>

        {/* مخطط التحليل المالي والاشتراكات (Area Chart) */}
        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">التحليل المالي ونمو الاشتراكات</h3>
            <p className="text-xs text-text-muted">نمو أرباح المنصة الناتجة عن اشتراكات المخابر وعوائد المساحات الإعلانية المعتمدة</p>
          </div>
          <div className="h-[300px] mt-6">
            <Area {...revenueConfig} />
          </div>
        </div>

      </div>

    </div>
  );
}