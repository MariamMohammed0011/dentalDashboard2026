import React from 'react';
import { useTranslation } from 'react-i18next';
import SubscriptionTable from '../components/SubscriptionTable';
import SubscriptionModal from '../components/SubscriptionModal';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { Loader2, Plus, CreditCard, Search, History, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SubscriptionsPage() {
  const { t } = useTranslation();
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

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" dir="rtl">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-border-main/60 pb-6">
        <div className="text-right w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <CreditCard className="text-emerald-500 shrink-0" size={32} />
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
            className="p-3 bg-bg-card border border-border-main rounded-2xl text-text-muted hover:text-text-main transition-colors shrink-0"
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

      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-bg-card p-3 rounded-[2rem] border border-border-main shadow-sm">
        {/* Tabs Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'expired'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
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

        {/* Instant Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('subscription.searchPlaceholder')}
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Subscription Table Component */}
      <SubscriptionTable
        subs={subs}
        isLoading={loading}
        onActivate={handleOpenActivateModal}
        onRenew={handleOpenRenewModal}
      />

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
