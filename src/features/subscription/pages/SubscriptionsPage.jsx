import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SubscriptionTable from '../components/SubscriptionTable';
import SubscriptionCardGrid from '../components/SubscriptionCardGrid';
import SubscriptionModal from '../components/SubscriptionModal';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { 
  Plus, CreditCard, Search, History, CheckCircle2, RefreshCw, 
  LayoutGrid, List, AlertTriangle, Building2, Hourglass 
} from 'lucide-react';

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const {
    subs,
    activeCount,
    expiredCount,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    loading,
    modalOpen,
    setModalOpen,
    modalType,
    selectedSub,
    handleOpenAddModal,
    handleOpenActivateModal,
    handleOpenRenewModal,
    handleModalSubmit,
    refreshSubscriptions,
  } = useSubscriptions();

  // Expiring soon count (< 30 days remaining)
  const expiringSoonCount = subs.filter(s => s.remainingDays > 0 && s.remainingDays <= 30).length;

  return (
    <div className="p-4 sm:p-8 lg:p-6 space-y-6" dir="rtl">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-border-main/60 pb-6">
        <div className="text-right w-full sm:w-auto">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 shadow-sm shrink-0">
              <CreditCard size={28} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-text-main">
                {t('subscription.headerTitle')}
              </h1>
              <p className="text-text-muted text-xs font-bold mt-0.5">
                {t('subscription.headerDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={refreshSubscriptions}
            disabled={loading}
            className="p-3 bg-bg-card border border-border-main rounded-2xl text-text-muted hover:text-text-main transition-colors shrink-0 cursor-pointer"
            title={t('common.refresh')}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin text-primary' : ''} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            {t('subscription.addSubscription')}
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {/* Total Subscriptions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-bg-card border border-border-main/70 rounded-[2.2rem] p-5.5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between relative overflow-hidden group"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-extrabold uppercase tracking-wider mb-1">إجمالي الاشتراكات</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">{activeCount + expiredCount}</span>
              <span className="text-xs font-bold text-text-muted">مخبر</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <Building2 size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Active Subscriptions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-bg-card border border-border-main/70 rounded-[2.2rem] p-5.5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between relative overflow-hidden group"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-extrabold uppercase tracking-wider mb-1">اشتراكات سارية</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tight">{activeCount}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">نشط</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Expired Subscriptions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-bg-card border border-border-main/70 rounded-[2.2rem] p-5.5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between relative overflow-hidden group"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-extrabold uppercase tracking-wider mb-1">اشتراكات منتهية</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight">{expiredCount}</span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">منتهي</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <History size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-rose-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Expiring Soon Subscriptions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-bg-card border border-border-main/70 rounded-[2.2rem] p-5.5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between relative overflow-hidden group"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-extrabold uppercase tracking-wider mb-1">تنتهي خلال 30 يوم</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">{expiringSoonCount}</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">تنتهي قريباً</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <Hourglass size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-amber-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      </div>

   
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 ">
        
        {/* Tabs Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <CheckCircle2 size={16} />
            <span>{t('subscription.activeTab')}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('expired')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'expired'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-[1.02]'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <History size={16} />
            <span>{t('subscription.expiredTab')}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'expired' ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-600'
            }`}>
              {expiredCount}
            </span>
          </button>
        </div>

       
        <div className="flex items-center gap-3 w-full md:w-auto">
       

          {/* View Mode Switcher Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-700/50' 
                  : 'text-text-muted hover:text-text-main'
              }`}
              title="عرض الكروت الفاخرة"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-700/50' 
                  : 'text-text-muted hover:text-text-main'
              }`}
              title="عرض الجدول المضغوط"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Content View (Smart Grid vs Compact Table) */}
      {viewMode === 'grid' ? (
        <SubscriptionCardGrid
          subs={subs}
          isLoading={loading}
          onActivate={handleOpenActivateModal}
          onRenew={handleOpenRenewModal}
        />
      ) : (
        <SubscriptionTable
          subs={subs}
          isLoading={loading}
          onActivate={handleOpenActivateModal}
          onRenew={handleOpenRenewModal}
        />
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        type={modalType}
        initialData={selectedSub}
      />
    </div>
  );
}

