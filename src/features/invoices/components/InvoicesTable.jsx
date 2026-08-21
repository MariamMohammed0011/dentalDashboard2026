import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Receipt,
  User,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  Hash
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
    <div className="w-full flex flex-col gap-4 font-zain" dir="rtl">
      {/* ── 1. Desktop & Tablet Scrollable Table Container ── */}
      <div className="hidden lg:block w-full overflow-x-auto custom-scrollbar rounded-2xl border border-slate-100/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full min-w-[950px] text-right border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold text-[12px] uppercase select-none">
              <th className="py-3.5 px-4 text-right min-w-[130px]">{t('invoices.invoiceId')}</th>
              <th className="py-3.5 px-4 text-right min-w-[220px]">{t('invoices.client')}</th>
              <th className="py-3.5 px-4 text-right min-w-[220px]">{t('invoices.adTitle')}</th>
              <th className="py-3.5 px-4 text-right min-w-[140px]">{t('invoices.createdAt')}</th>
              <th className="py-3.5 px-4 text-center min-w-[130px]">{t('invoices.amount')}</th>
              <th className="py-3.5 px-4 text-center min-w-[120px]">{t('invoices.status')}</th>
              <th className="py-3.5 px-4 text-left min-w-[90px]">{t('common.actions')}</th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-4 px-4">
                    <div className="h-10 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl w-full" />
                  </td>
                </tr>
              ))
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center text-text-muted dark:text-slate-500 font-bold">
                    <Receipt size={40} className="mb-2 opacity-40 text-primary" />
                    <span>{t('invoices.noInvoices')}</span>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const isPaid = inv.isPaidStatus ?? inv.isPaid;
                return (
                  <tr
                    key={`${inv.category || 'inv'}-${inv.id}`}
                    className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors duration-150"
                  >
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                          #{inv.id}
                        </div>
                        <span className="text-[11px] font-black text-text-muted">
                          {inv.categoryLabel || 'فاتورة'}
                        </span>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5 max-w-[220px]">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                          <User size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-text-main dark:text-gray-100 text-xs truncate" title={inv.userName}>
                            {inv.userName || 'غير معروف'}
                          </span>
                          <span className="text-[10px] text-text-muted dark:text-slate-500 font-bold truncate">
                            {inv.namePlace || inv.userEmail || '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Ad Title */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-text-main dark:text-gray-200 truncate" title={inv.title}>
                          {inv.title || 'إعلان بدون عنوان'}
                        </span>
                        {inv.target && (
                          <span className="text-[10px] font-black text-primary/80 mt-0.5 flex items-center gap-1">
                            <Tag size={10} />
                            <span>مستهدف: {inv.target}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                        <Calendar size={14} className="text-emerald-500 shrink-0" />
                        <span>{formatDate(inv.createdAt)}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-black text-sm text-text-main dark:text-gray-100">
                      {Number(inv.price || 0).toLocaleString()} <span className="text-[10px] text-text-muted font-normal">$</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border ${
                        isPaid
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50'
                      }`}>
                        {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <button
                        onClick={() => onOpenDetails(inv)}
                        className="p-2 bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800 dark:hover:bg-primary text-slate-600 dark:text-slate-300 rounded-xl transition-all active:scale-95 cursor-pointer"
                        title="معاينة الفاتورة"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── 2. Tablet Layout (2 Columns) ── */}
      <div className="hidden md:grid lg:hidden gap-4 grid-cols-2">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[200px] w-full" />
          ))
        ) : invoices.length === 0 ? (
          <div className="col-span-2 p-8 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl text-center text-text-muted font-bold">
            {t('invoices.noInvoices')}
          </div>
        ) : (
          invoices.map((inv) => {
            const isPaid = inv.isPaidStatus ?? inv.isPaid;
            return (
              <div
                key={`${inv.category || 'inv'}-${inv.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide">الفاتورة</p>
                    <p className="text-lg font-black text-primary">#{inv.id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black whitespace-nowrap ${
                    isPaid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
                  }`}>
                    {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                  </span>
                </div>

                {/* Client Info */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                  <p className="text-[11px] font-bold text-text-muted uppercase">العميل</p>
                  <p className="font-bold text-sm text-text-main break-words">{inv.userName || 'غير معروف'}</p>
                  <p className="text-xs text-text-muted font-semibold">{inv.namePlace || inv.userEmail || '—'}</p>
                </div>

                {/* Service Info */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                  <p className="text-[11px] font-bold text-text-muted uppercase">الخدمة</p>
                  <p className="text-sm font-bold text-text-main break-words">{inv.title || 'إعلان مدفوع'}</p>
                  {inv.target && (
                    <p className="text-[11px] font-black text-primary flex items-center gap-1">
                      <Tag size={12} />
                      <span>{inv.target}</span>
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-bold text-text-muted mb-1">المبلغ</p>
                    <p className="text-lg font-black text-primary">{Number(inv.price || 0).toLocaleString()} <span className="text-xs text-text-muted font-bold">$
                      </span></p>
                  </div>
                  <button
                    onClick={() => onOpenDetails(inv)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-black transition-all active:scale-95"
                  >
                    <Eye size={16} />
                    <span className="hidden sm:inline">عرض</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 3. Mobile Layout (Full Width Cards) ── */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-xl h-[150px] w-full" />
          ))
        ) : invoices.length === 0 ? (
          <div className="p-8 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl text-center text-text-muted font-bold">
            {t('invoices.noInvoices')}
          </div>
        ) : (
          invoices.map((inv) => {
            const isPaid = inv.isPaidStatus ?? inv.isPaid;
            return (
              <div
                key={`${inv.category || 'inv'}-${inv.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 rounded-xl p-3 space-y-2.5 shadow-sm active:shadow-lg transition-all"
              >
                {/* Top Row: ID + Status */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Hash size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted font-bold">الفاتورة</p>
                      <p className="font-black text-sm text-primary">#{inv.id}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black whitespace-nowrap ${
                    isPaid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  }`}>
                    {isPaid ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>{isPaid ? t('invoices.paid') : t('invoices.unpaid')}</span>
                  </span>
                </div>

                {/* Client Name */}
                <div className="flex items-start gap-2">
                  <User size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-text-muted font-bold">العميل</p>
                    <p className="text-xs font-bold text-text-main break-words">{inv.userName || 'غير معروف'}</p>
                  </div>
                </div>

                {/* Service Title */}
                <div className="flex items-start gap-2">
                  <Receipt size={14} className="text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-text-muted font-bold">الخدمة</p>
                    <p className="text-xs font-bold text-text-main break-words">{inv.title || 'إعلان مدفوع'}</p>
                  </div>
                </div>

                {/* Amount + Action */}
                <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-text-muted font-bold mb-0.5">المبلغ</p>
                    <p className="font-black text-sm text-primary">{Number(inv.price || 0).toLocaleString()} <span className="text-[10px] font-bold">$</span></p>
                  </div>
                  <button
                    onClick={() => onOpenDetails(inv)}
                    className="flex items-center justify-center w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all active:scale-95"
                    title="عرض التفاصيل"
                  >
                    <Eye size={18} />
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