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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-1.5 xs:p-2 sm:p-4 overflow-y-auto print:p-0 print:static" dir="rtl">
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
            className="relative bg-white dark:bg-slate-950 w-full max-w-sm xs:max-w-md sm:max-w-2xl lg:max-w-3xl rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-auto sm:my-6 border border-border-main flex flex-col text-right font-zain select-none print:shadow-none print:border-none print:w-full print:max-w-none print:my-0 print:rounded-none"
          >
            {/* Modal Header Bar (Hidden in Print) */}
            <div className="relative bg-white dark:bg-slate-900 border-b border-border-main/60 print:hidden">
              {/* Close Button - Top Right for mobile */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-2 right-2 sm:hidden p-1.5 xs:p-2 bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-rose-500 hover:text-white rounded-lg transition-all cursor-pointer z-10"
              >
                <X size={16} className="xs:w-5 xs:h-5" />
              </button>

              <div className="p-2.5 xs:p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
                <div className="flex items-start gap-2 xs:gap-3 flex-1 min-w-0 pr-8 sm:pr-0">
                  <div className="w-8 xs:w-10 sm:w-12 h-8 xs:h-10 sm:h-12 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center border border-primary/30 shadow-sm shrink-0">
                    <ShieldCheck size={18} className="xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs xs:text-sm sm:text-lg font-black tracking-tight font-zain text-text-main break-words">{t('invoices.invoiceDetailsTitle')} #{invoice.id}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-lg text-[10px] xs:text-xs font-bold border ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {isPaid ? <CheckCircle2 size={12} className="xs:w-3.5 xs:h-3.5" /> : <Clock size={12} className="xs:w-3.5 xs:h-3.5" />}
                        <span>{isPaid ? t('invoices.paid') : t('invoices.unpaid')}</span>
                      </span>
                      <span className="text-[10px] xs:text-xs text-text-muted font-medium">{invoice.categoryLabel || 'فاتورة رسمية'}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-text-main dark:text-slate-300 rounded-lg transition-all cursor-pointer flex items-center gap-2"
                    title="طباعة الفاتورة"
                  >
                    <Printer size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-rose-500 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Mobile Action Bar */}
              <div className="sm:hidden p-2 xs:p-3 flex gap-1.5 xs:gap-2 border-t border-border-main/40">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-3 py-2 xs:py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-[11px] xs:text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Printer size={14} className="xs:w-4 xs:h-4" />
                  <span className="hidden xs:inline">{t('invoices.printInvoice')}</span>
                  <span className="xs:hidden">طباعة</span>
                </button>
              </div>
            </div>

            {/* Invoice Document Body */}
            <div className="p-2.5 xs:p-4 sm:p-8 space-y-3 xs:space-y-4 sm:space-y-6 max-h-[82vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible bg-white dark:bg-slate-900 text-text-main font-zain">

              {/* Top Branding & Invoice Status Header */}
              <div className="border-b border-border-main/60 pb-4 xs:pb-5 sm:pb-6">
                <div className="flex items-center justify-between gap-3 xs:gap-4 mb-4 xs:mb-5">
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 flex-1">
                    <div className="p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shrink-0 shadow-sm">
                      <img src={logoImg} alt="Platform Logo" className="w-8 xs:w-10 sm:w-12 h-8 xs:h-10 sm:h-12 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xs xs:text-sm sm:text-lg font-black text-text-main tracking-tight break-words leading-tight">{t('invoices.dentalDigitalPlatform')}</h2>
                      <p className="text-[9px] xs:text-xs text-text-muted font-medium mt-0.5">Digital Platform for Dental Services</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <p className="text-[10px] xs:text-xs text-text-muted font-bold uppercase tracking-wider">رقم الفاتورة</p>
                    <p className="text-base xs:text-lg sm:text-xl font-black text-primary dir-ltr">#{invoice.id}</p>
                  </div>
                </div>
              </div>

              {/* Grid Section 1: Client Info & Invoice Dates */}
              <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
                {/* Advertiser Info Card */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 p-2.5 xs:p-3.5 sm:p-4 rounded-lg xs:rounded-xl sm:rounded-2xl border border-border-main/80">
                  <h3 className="text-[10px] xs:text-xs font-black text-text-muted uppercase tracking-wider mb-2 xs:mb-3">
                    {t('invoices.advertiserInfo')}
                  </h3>

                  <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                    {invoice.userName && (
                      <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                        <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <User size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-text-muted font-bold">الاسم</p>
                          <p className="text-xs xs:text-sm font-black text-text-main break-words">{invoice.userName}</p>
                        </div>
                      </div>
                    )}

                    {invoice.namePlace && (
                      <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                        <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-sky-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-text-muted font-bold">المكان</p>
                          <p className="text-xs xs:text-sm font-bold text-text-main break-words">{invoice.namePlace}</p>
                        </div>
                      </div>
                    )}

                    {invoice.userEmail && (
                      <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                        <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-purple-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-text-muted font-bold">البريد الإلكتروني</p>
                          <p className="text-xs xs:text-sm font-bold text-text-main break-all dir-ltr text-[11px] xs:text-xs">{invoice.userEmail}</p>
                        </div>
                      </div>
                    )}

                    {invoice.userPhone && (
                      <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                        <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Phone size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-text-muted font-bold">الهاتف</p>
                          <p className="text-xs xs:text-sm font-bold text-text-main dir-ltr">{invoice.userPhone}</p>
                        </div>
                      </div>
                    )}

                    {(invoice.addressPlace || invoice.cityPlace || invoice.countryPlace) && (
                      <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                        <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-rose-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-text-muted font-bold">العنوان</p>
                          <p className="text-xs xs:text-sm font-bold text-text-main break-words">{[invoice.addressPlace, invoice.cityPlace, invoice.countryPlace].filter(Boolean).join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates & Target Info Card */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 p-2.5 xs:p-3.5 sm:p-4 rounded-lg xs:rounded-xl sm:rounded-2xl border border-border-main/80">
                  <h3 className="text-[10px] xs:text-xs font-black text-text-muted uppercase tracking-wider mb-2 xs:mb-3">
                    {t('invoices.invoiceDetailsAndDates')}
                  </h3>

                  <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                    <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                      <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-emerald-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] xs:text-xs text-text-muted font-bold">{t('invoices.createdAt')}</p>
                        <p className="text-xs xs:text-sm font-black text-text-main">{formatDate(invoice.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                      <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-amber-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] xs:text-xs text-text-muted font-bold">{t('invoices.expiresAt')}</p>
                        <p className="text-xs xs:text-sm font-black text-text-main">{formatDate(invoice.expiresAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                      <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Tag size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] xs:text-xs text-text-muted font-bold">{t('invoices.target')}</p>
                        <span className="inline-block bg-primary/10 text-primary dark:text-primary-light border border-primary/20 px-1.5 xs:px-2.5 py-0.5 rounded-lg font-black text-[10px] xs:text-xs mt-0.5 xs:mt-1">
                          {invoice.target || t('invoices.allCategories')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service / Item Breakdown Table */}
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-1.5 xs:gap-2">
                  <div className="w-7 xs:w-8 h-7 xs:h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <Tag size={14} className="xs:w-4 xs:h-4" />
                  </div>
                  <span className="text-xs xs:text-sm font-black text-text-main uppercase tracking-wider font-zain">
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
                <div className="sm:hidden bg-slate-50/80 dark:bg-slate-800/40 border border-border-main/80 rounded-lg xs:rounded-xl p-2.5 xs:p-3.5 space-y-2 xs:space-y-2.5">
                  <div className="flex items-start gap-2 xs:gap-2.5">
                    <div className="w-7 xs:w-8 h-7 xs:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={14} className="xs:w-4 xs:h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] xs:text-xs text-text-muted font-bold mb-0.5 xs:mb-1">{t('invoices.descriptionAndTitle')}</p>
                      <p className="font-black text-xs xs:text-sm text-text-main break-words">{invoice.title || t('invoices.paidAdOnPlatform')}</p>
                      {invoice.content && (
                        <p className="text-text-muted text-[10px] xs:text-xs font-semibold bg-slate-200 dark:bg-slate-700 px-1.5 xs:px-2.5 py-0.5 rounded-md mt-1.5 xs:mt-2 inline-block">
                          {invoice.content}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border-main/40 pt-2 xs:pt-2.5 flex items-start gap-2 xs:gap-2.5">
                    <div className="w-7 xs:w-8 h-7 xs:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Tag size={14} className="xs:w-4 xs:h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] xs:text-xs text-text-muted font-bold mb-0.5 xs:mb-1">{t('invoices.target')}</p>
                      <span className="inline-block bg-primary/10 text-primary dark:text-primary-light border border-primary/20 px-2 xs:px-3 py-0.5 xs:py-1 rounded-lg font-black text-[10px] xs:text-xs">
                        {invoice.target || t('common.all')}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border-main/40 pt-2 xs:pt-2.5 flex items-start gap-2 xs:gap-2.5">
                    <div className="w-7 xs:w-8 h-7 xs:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <DollarSign size={14} className="xs:w-4 xs:h-4 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] xs:text-xs text-text-muted font-bold mb-0.5 xs:mb-1">{t('invoices.amount')}</p>
                      <p className="font-black text-sm xs:text-lg text-emerald-600 dark:text-emerald-400 dir-ltr">
                        {Number(invoice.price || 0).toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Official Documented Verification Footer */}
              <div className="pt-3 xs:pt-4 sm:pt-6 border-t border-border-main/50 space-y-2 xs:space-y-2.5 sm:space-y-3">
                <p className="text-center text-[10px] xs:text-xs sm:text-sm text-text-muted font-bold">{t('invoices.invoiceThankYou')}</p>
                <div className="flex items-center justify-center gap-1.5 xs:gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-lg sm:rounded-xl border border-emerald-500/20 font-black shadow-sm">
                  <CheckCircle2 size={14} className="xs:w-4.5 xs:h-4.5 sm:w-4.5 sm:h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-[10px] xs:text-xs sm:text-sm">{t('invoices.documentedElectronicInvoice')}</span>
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
