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
    <div className="p-3 sm:p-4 lg:p-4 flex flex-col gap-4 sm:gap-6 bg-transparent font-zain" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 w-full border-b border-border-main/60 pb-4 sm:pb-6">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <Receipt className="text-primary shrink-0 mt-0.5" size={28} />
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-text-main">
              {t('invoices.headerTitle')}
            </h1>
            <p className="text-text-muted text-xs font-bold mt-1">
              {t('invoices.headerDesc')}
            </p>
          </div>
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

      {/* ── Main Filter Bar (Responsive 2-Tier Controls - No Horizontal Scroll) ── */}
      <div className="bg-white dark:bg-bg-card p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-border-main/80 shadow-sm flex flex-col gap-3 sm:gap-4">

        {/* Tier 1: Status Tabs Switcher */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 sm:p-1.5 rounded-lg sm:rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('paid')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'paid'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <CheckCircle2 size={14} className="sm:size-4" />
              <span className="hidden sm:inline">{t('invoices.paidTab')}</span>
              <span className="text-[10px] font-bold">{paidCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('unpaid')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'unpaid'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Clock size={14} className="sm:size-4" />
              <span className="hidden sm:inline">{t('invoices.unpaidTab')}</span>
              <span className="text-[10px] font-bold">{unpaidCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Receipt size={14} className="sm:size-4" />
              <span className="hidden sm:inline">{t('invoices.allTab')}</span>
              <span className="text-[10px] font-bold">{paidCount + unpaidCount}</span>
            </button>
          </div>

        {/* Tier 2: Category Filter Pills (Wrap flexibly without scrolling) */}
        <div className="pt-3 border-t border-border-main/50 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-black text-text-muted flex items-center gap-1 shrink-0">
            <Filter size={14} className="text-primary" />
            <span className="hidden sm:inline">التصنيف:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/20 border border-primary'
                : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main border border-transparent'
            }`}
          >
            {t('invoices.allUsers')}
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('dentists')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'dentists'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 border border-blue-600'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
            }`}
          >
            {t('invoices.dentists')}
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('labs')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'labs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-600'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            {t('invoices.labs')}
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('adsClients')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'adsClients'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 border border-purple-600'
                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/20'
            }`}
          >
            {t('invoices.adsClients')}
          </button>
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
