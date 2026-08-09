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
                      {Number(inv.price || 0).toLocaleString()} <span className="text-[10px] text-text-muted font-normal">ر.س</span>
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

      {/* ── 2. Mobile Layout (نفس ألوانك وبنيتك السابقة) ── */}
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
                    isPaid 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  }`}>
                    {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-text-main dark:text-gray-100 truncate">{inv.userName || 'غير معروف'}</h4>
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