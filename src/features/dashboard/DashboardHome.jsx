import React from 'react';
import WelcomeHeader from './components/WelcomeHeader';

const StatCard = ({ title, count, textColor }) => (
  <div className="card bg-bg-card shadow-sm border border-border-main rounded-[2rem] p-8 transition-transform hover:scale-[1.02]">
    <div className="flex flex-col items-start gap-2 text-right">
      <h3 className="text-text-muted font-bold text-lg">{title}</h3>
      <span className={`text-5xl font-black ${textColor}`}>{count}</span>
    </div>
  </div>
);

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      {/* هيدر الترحيب */}
      <WelcomeHeader 
        name="مى محمد" 
        role="SuperAdmin" 
        date="30 نيسان 2026" 
      />

      {/* شبكة الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="طلبات تحتاج تدخل يدوي:" count="8" textColor="text-primary" />
        <StatCard title="طلبات اليوم:" count="24" textColor="text-primary" />
        <StatCard title="طلبات فشلت تقنياً:" count="6" textColor="text-red-500" />
        <StatCard title="طلبات قيد التنفيذ:" count="9" textColor="text-primary" />
      </div>
    </div>
  );
}