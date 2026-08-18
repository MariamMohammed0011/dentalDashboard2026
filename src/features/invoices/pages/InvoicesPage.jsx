import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvoices } from '../hooks/useInvoices';
import InvoicesTable from '../components/InvoicesTable';
import InvoiceDetailsModal from '../components/InvoiceDetailsModal';
import {
  Receipt, DollarSign, CheckCircle2, Clock, Search, RefreshCw,
  Users, User, FlaskConical, Megaphone, Filter
} from 'lucide-react';

export default function InvoicesPage() {
  const { t } = useTranslation();
  const {
    invoices,
    loading,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalPaidRevenue,
    totalUnpaidAmount,
    paidCount,
    unpaidCount,
    selectedInvoice,
    modalOpen,
    setModalOpen,
    handleOpenDetails,
    refreshInvoices,
  } = useInvoices();

  return (
    <div className=" flex flex-col gap-4 sm:gap-6 bg-transparent font-zain" dir="rtl">

      

      <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 text-primary  shadow-sm border border-primary/20 flex items-center justify-center">
            <Receipt size={26} className="text-primary" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
               {t('invoices.headerTitle')}
            </h1>
            
          </div>
        </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Paid Revenue Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl lg:rounded-[2rem] space-y-2 sm:space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex-1">
              {t('invoices.totalPaidRevenue')}
            </span>
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 size={18} className="sm:size-5" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-text-main break-words">
              {totalPaidRevenue.toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span>
            </span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
              {paidCount} {t('invoices.paidInvoicesCount')}
            </p>
          </div>
        </div>

        {/* Unpaid Amount Card */}
        <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl lg:rounded-[2rem] space-y-2 sm:space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider flex-1">
              {t('invoices.totalUnpaidAmount')}
            </span>
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock size={18} className="sm:size-5" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-text-main break-words">
              {totalUnpaidAmount.toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span>
            </span>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1.5">
              {unpaidCount} {t('invoices.unpaidInvoicesCount')}
            </p>
          </div>
        </div>

        {/* Overall Invoices Summary Card */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl lg:rounded-[2rem] space-y-2 sm:space-y-3 shadow-sm relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-black text-primary uppercase tracking-wider flex-1">
              {t('invoices.totalVolume')}
            </span>
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-2xl bg-primary/20 text-primary shrink-0">
              <DollarSign size={18} className="sm:size-5" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-text-main break-words">
              {(totalPaidRevenue + totalUnpaidAmount).toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span>
            </span>
            <p className="text-xs font-bold text-primary mt-1.5">
              {paidCount + unpaidCount} {t('invoices.totalInvoicesIssued')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Filter Bar (Responsive 2-Tier Controls) ── */}
      <div className="bg-gradient-to-r from-white via-slate-50/50 to-white dark:from-slate-800/60 dark:via-slate-800/50 dark:to-slate-800/60 p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-700/40 shadow-sm flex flex-col gap-4 xs:gap-5 sm:gap-6">

        {/* Tier 1: Status Tabs Switcher */}
        <div className="flex flex-col xs:flex-col sm:flex-row gap-2 xs:gap-3">
          <div className="text-xs xs:text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0 py-1.5">
            {t('common.status')}:
          </div>
          <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:flex sm:gap-2 bg-gradient-to-r from-slate-100/60 to-slate-100/40 dark:from-slate-800/40 dark:to-slate-800/20 p-1.5 xs:p-2 rounded-lg xs:rounded-xl border border-slate-200/50 dark:border-slate-700/30 flex-1 sm:flex-none">
            <button
              type="button"
              onClick={() => setActiveTab('paid')}
              className={`flex items-center justify-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === 'paid'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CheckCircle2 size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('invoices.paidTab')}</span>
              <span className="inline xs:hidden">{paidCount}</span>
              <span className="text-[10px] xs:text-xs font-bold">{paidCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('unpaid')}
              className={`flex items-center justify-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === 'unpaid'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 border border-red-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('invoices.unpaidTab')}</span>
              <span className="inline xs:hidden">بانتظار</span>
              <span className="text-[10px] xs:text-xs font-bold">{unpaidCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex items-center justify-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Receipt size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('invoices.allTab')}</span>
              <span className="inline xs:hidden">الكل</span>
              <span className="text-[10px] xs:text-xs font-bold">{paidCount + unpaidCount}</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-200/0 via-slate-200/60 to-slate-200/0 dark:from-slate-700/0 dark:via-slate-700/40 dark:to-slate-700/0" />

        {/* Tier 2: Category Filter Pills */}
        <div className="flex flex-col xs:flex-col sm:flex-row gap-2.5 xs:gap-3 sm:gap-4">
          <div className="text-xs xs:text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2 shrink-0 py-1.5">
            <Filter size={16} className="xs:w-5 xs:h-5 text-blue-600 dark:text-blue-400" />
            <span className="hidden xs:inline">التصنيف:</span>
          </div>

          <div className="flex flex-wrap gap-1.5 xs:gap-2 flex-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap border-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-700/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600/60'
              }`}
            >
              {t('invoices.allUsers')}
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('dentists')}
              className={`px-2.5 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap border-2 ${
                selectedCategory === 'dentists'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                  : 'bg-blue-50/60 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-800/60'
              }`}
            >
              {t('invoices.dentists')}
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('labs')}
              className={`px-2.5 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap border-2 ${
                selectedCategory === 'labs'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-50/60 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/30 hover:border-emerald-300 dark:hover:border-emerald-800/60'
              }`}
            >
              {t('invoices.labs')}
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('adsClients')}
              className={`px-2.5 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer whitespace-nowrap border-2 ${
                selectedCategory === 'adsClients'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-purple-50/60 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-800/60'
              }`}
            >
              {t('invoices.adsClients')}
            </button>
          </div>
        </div>

      </div>

      {/* ── Invoices Table Component ── */}
      <InvoicesTable
        invoices={invoices}
        isLoading={loading}
        onOpenDetails={handleOpenDetails}
      />

      {/* ── Invoice Details & Printable Modal ── */}
      <InvoiceDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
