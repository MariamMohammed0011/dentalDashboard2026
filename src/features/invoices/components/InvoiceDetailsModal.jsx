import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, Printer, CheckCircle2, Clock, Building2, User, Mail, Phone, MapPin, Tag,
  FileText, ShieldCheck, DollarSign, Image as ImageIcon, Calendar, Sparkles, Hash, ArrowLeft
} from 'lucide-react';
import logoImg from '../../../assets/logo.png';

export default function InvoiceDetailsModal({ isOpen, onClose, invoice }) {
  const { t } = useTranslation();

  if (typeof document === 'undefined') return null;
  if (!invoice) return null;

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

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.isPaidStatus ?? invoice.isPaid;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:static" dir="rtl">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white dark:bg-slate-950 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto sm:my-6 border border-border-main flex flex-col text-right font-zain select-none print:shadow-none print:border-none print:w-full print:max-w-none print:my-0 print:rounded-none"
          >
            {/* Modal Header Bar (Hidden in Print) */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white print:hidden">
              {/* Close Button - Top Right for mobile */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 sm:hidden p-2 bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 rounded-xl transition-all cursor-pointer z-10"
              >
                <X size={20} />
              </button>

              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/60">
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-8 sm:pr-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm shrink-0">
                    <ShieldCheck size={24} className="text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-black tracking-tight font-zain break-words">{t('invoices.invoiceDetailsTitle')} #{invoice.id}</h3>
                    <p className="text-xs text-slate-400 font-medium font-zain mt-1">{invoice.categoryLabel || 'فاتورة رسمية'}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 shrink-0">
                 
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Mobile Action Bar */}
              <div className="sm:hidden p-3 flex gap-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Printer size={16} />
                  <span>{t('invoices.printInvoice')}</span>
                </button>
              </div>
            </div>

            {/* Invoice Document Body */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 max-h-[82vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible bg-white dark:bg-slate-900 text-text-main font-zain">
              
              {/* Top Branding & Invoice Status Header */}
              <div className="border-b border-border-main/60 pb-4 sm:pb-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="p-2 sm:p-2.5 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                    <img src={logoImg} alt="Platform Logo" className="w-10 sm:w-12 h-10 sm:h-12 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm sm:text-xl font-black text-text-main tracking-tight break-words">{t('invoices.dentalDigitalPlatform')}</h2>
                    <p className="text-xs text-text-muted font-bold mt-1">Dental Platform Advertising & Invoicing System</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-between sm:items-center">
                  <div className="col-span-1">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">رقم الفاتورة</p>
                    <p className="text-base sm:text-lg font-black text-text-main dir-ltr">#{invoice.id}</p>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${
                      isPaid
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-2xs'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-2xs'
                    }`}>
                      {isPaid ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Clock size={16} className="text-rose-500 shrink-0" />}
                      <span>{isPaid ? t('invoices.paid') : t('invoices.unpaid')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Section 1: Client Info & Invoice Dates */}
              <div className="space-y-4">
                {/* Advertiser Info Card */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-border-main/80">
                  <h3 className="text-xs font-black text-text-muted uppercase tracking-wider mb-3">
                    {t('invoices.advertiserInfo')}
                  </h3>

                  <div className="space-y-3">
                    {invoice.userName && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <User size={16} className="text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text-muted font-bold">الاسم</p>
                          <p className="text-sm font-black text-text-main break-words">{invoice.userName}</p>
                        </div>
                      </div>
                    )}

                    {invoice.namePlace && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 size={16} className="text-sky-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text-muted font-bold">المكان</p>
                          <p className="text-sm font-bold text-text-main break-words">{invoice.namePlace}</p>
                        </div>
                      </div>
                    )}

                    {invoice.userEmail && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail size={16} className="text-purple-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text-muted font-bold">البريد الإلكتروني</p>
                          <p className="text-sm font-bold text-text-main break-all dir-ltr">{invoice.userEmail}</p>
                        </div>
                      </div>
                    )}

                    {invoice.userPhone && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Phone size={16} className="text-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text-muted font-bold">الهاتف</p>
                          <p className="text-sm font-bold text-text-main dir-ltr">{invoice.userPhone}</p>
                        </div>
                      </div>
                    )}

                    {(invoice.addressPlace || invoice.cityPlace || invoice.countryPlace) && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin size={16} className="text-rose-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text-muted font-bold">العنوان</p>
                          <p className="text-sm font-bold text-text-main break-words">{[invoice.addressPlace, invoice.cityPlace, invoice.countryPlace].filter(Boolean).join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates & Target Info Card */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-border-main/80">
                  <h3 className="text-xs font-black text-text-muted uppercase tracking-wider mb-3">
                    {t('invoices.invoiceDetailsAndDates')}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar size={16} className="text-emerald-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted font-bold">{t('invoices.createdAt')}</p>
                        <p className="text-sm font-black text-text-main">{formatDate(invoice.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock size={16} className="text-amber-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted font-bold">{t('invoices.expiresAt')}</p>
                        <p className="text-sm font-black text-text-main">{formatDate(invoice.expiresAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Tag size={16} className="text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted font-bold">{t('invoices.target')}</p>
                        <span className="inline-block bg-primary/10 text-primary dark:text-primary-light border border-primary/20 px-2.5 py-0.5 rounded-lg font-black text-xs mt-1">
                          {invoice.target || t('invoices.allCategories')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service / Item Breakdown Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Tag size={16} />
                  </div>
                  <span className="text-sm font-black text-text-main uppercase tracking-wider font-zain">
                    {t('invoices.serviceDetails')}
                  </span>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block border border-border-main/80 rounded-2xl overflow-hidden shadow-2xs bg-white dark:bg-slate-900">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-800/60 dark:to-slate-800 text-text-muted font-black border-b border-border-main/60">
                      <tr>
                        <th className="p-3.5 text-right">{t('invoices.descriptionAndTitle')}</th>
                        <th className="p-3.5 text-center">{t('invoices.target')}</th>
                        <th className="p-3.5 text-left">{t('invoices.amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/50 font-bold">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 space-y-1">
                          <span className="font-black text-sm text-text-main block">{invoice.title || t('invoices.paidAdOnPlatform')}</span>
                          {invoice.content && (
                            <span className="inline-block text-text-muted text-xs font-semibold bg-slate-100 dark:bg-slate-800/60 px-2.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              {invoice.content}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-block bg-primary/10 text-primary dark:text-primary-light border border-primary/20 px-3 py-1 rounded-xl font-black text-xs shadow-2xs">
                            {invoice.target || t('common.all')}
                          </span>
                        </td>
                        <td className="p-3.5 text-left font-black text-base text-emerald-600 dark:text-emerald-400 whitespace-nowrap dir-ltr">
                          {Number(invoice.price || 0).toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden bg-slate-50/80 dark:bg-slate-800/40 border border-border-main/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-text-muted font-bold mb-1">{t('invoices.descriptionAndTitle')}</p>
                      <p className="font-black text-sm text-text-main break-words">{invoice.title || t('invoices.paidAdOnPlatform')}</p>
                      {invoice.content && (
                        <p className="text-text-muted text-xs font-semibold bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-md mt-2 inline-block">
                          {invoice.content}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border-main/40 pt-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Tag size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-text-muted font-bold mb-1">{t('invoices.target')}</p>
                      <span className="inline-block bg-primary/10 text-primary dark:text-primary-light border border-primary/20 px-3 py-1 rounded-lg font-black text-xs">
                        {invoice.target || t('common.all')}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border-main/40 pt-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <DollarSign size={16} className="text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-text-muted font-bold mb-1">{t('invoices.amount')}</p>
                      <p className="font-black text-lg text-emerald-600 dark:text-emerald-400 dir-ltr">
                        {Number(invoice.price || 0).toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Official Documented Verification Footer */}
              <div className="pt-4 sm:pt-6 border-t border-border-main/50 space-y-3">
                <p className="text-center text-xs sm:text-sm text-text-muted font-bold">{t('invoices.invoiceThankYou')}</p>
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20 font-black shadow-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-xs sm:text-sm">{t('invoices.documentedElectronicInvoice')}</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
