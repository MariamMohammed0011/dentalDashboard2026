import React from 'react';
import { useTranslation } from 'react-i18next';
import SubscriptionTable from '../components/SubscriptionTable';
import SubscriptionModal from '../components/SubscriptionModal';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { Loader2, Plus, CreditCard } from 'lucide-react';

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const {
    subs,
    loading,
    modalOpen,
    setModalOpen,
    modalType,
    selectedSub,
    handleOpenAddModal,
    handleOpenActivateModal,
    handleOpenRenewModal,
    handleModalSubmit,
  } = useSubscriptions();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-text-muted text-sm font-bold">جاري تحميل الاشتراكات...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 lg:p-12 space-y-6" dir="rtl">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="text-right w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-black text-text-main dark:text-gray-100 flex items-center gap-3">
            <CreditCard className="text-emerald-500 shrink-0" size={28} />
            {t('subscription.headerTitle')}
          </h1>
          <p className="text-gray-400 text-xs font-bold mt-1">
            إدارة اشتراكات المختبرات وتجديد الصلاحيات
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          إضافة اشتراك جديد
        </button>
      </div>

      {/* Subscription Table/Cards Component */}
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
