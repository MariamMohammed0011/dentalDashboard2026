import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Receipt, Building2, User, Mail, Calendar, DollarSign,
  Eye, CheckCircle2, Clock, ShieldCheck, Tag
} from 'lucide-react';

export default function InvoicesTable({ invoices, isLoading, onOpenDetails }) {
  const { t } = useTranslation();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full flex flex-col gap-3" dir="rtl">
      {/* ── Desktop Header ── */}
      <div className="hidden lg:flex items-center w-full px-6 py-2 text-slate-400 dark:text-slate-500 font-extrabold text-[12px] uppercase select-none">
        <div className="w-[12%] text-right">{t('invoices.invoiceId')}</div>
        <div className="w-[25%] text-right">{t('invoices.client')}</div>
        <div className="w-[23%] text-right">{t('invoices.adTitle')}</div>
        <div className="w-[12%] text-right">{t('invoices.createdAt')}</div>
        <div className="w-[10%] text-center">{t('invoices.amount')}</div>
        <div className="w-[10%] text-center">{t('invoices.status')}</div>
        <div className="w-[8%] text-left">{t('common.actions')}</div>
      </div>

      {/* ── Desktop Rows ── */}
      <div className="hidden lg:flex flex-col gap-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[78px] w-full" />
          ))
        ) : invoices.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center text-text-muted dark:text-slate-500 font-bold w-full">
            <Receipt size={40} className="mx-auto mb-2 opacity-40 text-primary" />
            {t('invoices.noInvoices')}
          </div>
        ) : (
          invoices.map((inv) => {
            const isPaid = inv.isPaidStatus ?? inv.isPaid;
            return (
              <div
                key={`${inv.category || 'inv'}-${inv.id}`}
                className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 gap-2"
              >
                {/* ID Column */}
                <div className="w-[12%] flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                    #{inv.id}
                  </div>
                  <span className="text-[11px] font-black text-text-muted">
                    {inv.categoryLabel || 'فاتورة'}
                  </span>
                </div>

                {/* Client Column */}
                <div className="w-[25%] flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-text-main dark:text-gray-100 text-[13px] truncate" title={inv.userName}>
                      {inv.userName || 'غير معروف'}
                    </span>
                    <span className="text-[10px] text-text-muted dark:text-slate-500 font-bold truncate">
                      {inv.namePlace || inv.userEmail || '—'}
                    </span>
                  </div>
                </div>

                {/* Ad Title Column */}
                <div className="w-[23%] flex flex-col justify-center min-w-0">
                  <span className="text-xs font-bold text-text-main dark:text-gray-200 truncate" title={inv.title}>
                    {inv.title || 'إعلان بدون عنوان'}
                  </span>
                  {inv.target && (
                    <span className="text-[10px] font-black text-primary/80 mt-0.5">
                      مستهدف: {inv.target}
                    </span>
                  )}
                </div>

                {/* Date Column */}
                <div className="w-[12%] flex items-center gap-1.5 text-text-muted text-xs font-semibold min-w-0">
                  <Calendar size={14} className="text-emerald-500 shrink-0" />
                  <span>{formatDate(inv.createdAt)}</span>
                </div>

                {/* Amount Column */}
                <div className="w-[10%] text-center font-black text-sm text-text-main dark:text-gray-100">
                  {Number(inv.price || 0).toLocaleString()} ر.س
                </div>

                {/* Status Column */}
                <div className="w-[10%] flex justify-center shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border ${
                    isPaid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50'
                  }`}>
                    {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                  </span>
                </div>

                {/* Actions Column */}
                <div className="w-[8%] flex justify-end shrink-0">
                  <button
                    onClick={() => onOpenDetails(inv)}
                    className="p-2 bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800 dark:hover:bg-primary text-slate-600 dark:text-slate-300 rounded-xl transition-all active:scale-95 cursor-pointer"
                    title="معاينة الفاتورة"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Mobile Layout ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:hidden">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[160px] w-full" />
          ))
        ) : invoices.length === 0 ? (
          <div className="p-8 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl text-center text-text-muted font-bold">
            {t('invoices.noInvoices')}
          </div>
        ) : (
          invoices.map((inv) => {
            const isPaid = inv.isPaidStatus ?? inv.isPaid;
            return (
              <div
                key={`${inv.category || 'inv'}-${inv.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black text-primary">#INV-{inv.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-text-main truncate">{inv.userName || 'غير معروف'}</h4>
                  <p className="text-xs text-text-muted font-semibold truncate">{inv.title || 'إعلان مدفوع'}</p>
                </div>

                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-primary font-black text-sm">{Number(inv.price || 0).toLocaleString()} ر.س</span>
                  <button
                    onClick={() => onOpenDetails(inv)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-black"
                  >
                    <Eye size={14} />
                    <span>عرض التفاصيل</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
