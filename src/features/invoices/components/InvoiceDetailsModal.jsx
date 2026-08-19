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
            <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 border-b border-blue-200/40 dark:border-slate-700/60 print:hidden">
              {/* Close Button - Top Right for mobile */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-2 right-2 sm:hidden p-1.5 xs:p-2 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-rose-500 hover:text-white rounded-lg transition-all cursor-pointer z-10 shadow-sm"
              >
                <X size={16} className="xs:w-5 xs:h-5" />
              </button>

              <div className="p-3 xs:p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4">
                <div className="flex items-center gap-3 xs:gap-4 flex-1 min-w-0 pr-8 sm:pr-0">
                  <div className="w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/40 shadow-md shrink-0">
                    <ShieldCheck size={20} className="xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm xs:text-base sm:text-xl font-black tracking-tight font-zain text-slate-900 dark:text-white break-words leading-tight">{t('invoices.invoiceDetailsTitle')} #{invoice.id}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-xs font-bold border shadow-sm ${
                        isPaid
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/40 dark:border-emerald-500/30'
                          : 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-300/40 dark:border-orange-500/30'
                      }`}>
                        {isPaid ? <CheckCircle2 size={14} className="xs:w-4 xs:h-4" /> : <Clock size={14} className="xs:w-4 xs:h-4" />}
                        <span>{isPaid ? t('invoices.paid') : t('invoices.unpaid')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  {/* <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2.5 bg-white hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-200/60 dark:border-slate-600/60"
                    title="طباعة الفاتورة"
                  >
                    <Printer size={18} />
                  </button> */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2.5 bg-white hover:bg-rose-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-200/60 dark:border-slate-600/60"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Mobile Action Bar */}
              <div className="sm:hidden px-3 xs:px-5 pb-3 xs:pb-4 flex gap-2 xs:gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-3 xs:px-4 py-2 xs:py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Printer size={14} className="xs:w-4 xs:h-4" />
                  <span>{t('invoices.printInvoice')}</span>
                </button>
              </div>
            </div>

            {/* Invoice Document Body */}
            <div className="p-2.5 xs:p-4 sm:p-8 space-y-3 xs:space-y-4 sm:space-y-6 max-h-[82vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible bg-white dark:bg-slate-900 text-text-main font-zain">

              {/* Top Branding & Invoice Header */}
              <div className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-b border-blue-100/40 dark:border-slate-700/40 pb-5 xs:pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 xs:gap-5 sm:gap-6">
                  <div className="flex items-center gap-3 xs:gap-4 flex-1">
                    <div className="p-2 xs:p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-blue-400/10 border border-blue-200/60 dark:border-blue-800/40 shrink-0 shadow-lg">
                      <img src={logoImg} alt="Platform Logo" className="w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm xs:text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight break-words leading-tight">{t('invoices.dentalDigitalPlatform')}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Digital Platform for Dental Services</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 bg-gradient-to-br from-blue-50/60 dark:from-slate-800/60 to-transparent px-3 xs:px-4 py-2 xs:py-3 rounded-xl border border-blue-100/40 dark:border-slate-700/40">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">رقم الفاتورة</p>
                    <p className="text-lg xs:text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 dir-ltr">#{invoice.id}</p>
                  </div>
                </div>
              </div>

              {/* Grid Section 1: Client Info & Invoice Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-5">
                {/* Advertiser Info Card */}
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-slate-800/50 dark:to-slate-800/30 p-3 xs:p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-200/40 dark:border-slate-700/40 shadow-sm">
                  <h3 className="text-xs xs:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 xs:mb-4 flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-500/20 rounded-full"></span>
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

                    {/* {invoice.userEmail && (
                      <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                        <div className="w-7 xs:w-8 sm:w-8 h-7 xs:h-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-purple-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-text-muted font-bold">البريد الإلكتروني</p>
                          <p className="text-xs xs:text-sm font-bold text-text-main break-all dir-ltr text-[11px] xs:text-xs">{invoice.userEmail}</p>
                        </div>
                      </div>
                    )} */}

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
                <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-slate-800/50 dark:to-slate-800/30 p-3 xs:p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-200/40 dark:border-slate-700/40 shadow-sm">
                  <h3 className="text-xs xs:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 xs:mb-4 flex items-center gap-2">
                    <span className="w-4 h-4 bg-emerald-500/20 rounded-full"></span>
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
              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 xs:w-9 h-8 xs:h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/40 dark:border-purple-800/40 shrink-0 shadow-sm">
                    <Tag size={16} className="xs:w-5 xs:h-5" />
                  </div>
                  <span className="text-sm xs:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider font-zain">
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
                <div className="sm:hidden bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 rounded-xl p-4 xs:p-5 space-y-4 xs:space-y-5 shadow-sm">
                  <div className="flex items-start gap-3 xs:gap-4">
                    <div className="w-9 xs:w-10 h-9 xs:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-purple-200/40 dark:border-purple-800/40">
                      <FileText size={16} className="xs:w-5 xs:h-5 text-purple-600 dark:text-purple-400" />
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
              <div className="pt-5 xs:pt-6 sm:pt-8 border-t border-blue-100/40 dark:border-slate-700/40 space-y-3 xs:space-y-4">
                <p className="text-center text-xs xs:text-sm text-slate-600 dark:text-slate-400 font-semibold">{t('invoices.invoiceThankYou')}</p>
                <div className="flex items-center justify-center gap-2 xs:gap-3 text-emerald-700 dark:text-emerald-300 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 dark:from-emerald-900/20 dark:to-teal-900/10 px-4 xs:px-5 py-3 xs:py-4 rounded-xl sm:rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 font-black shadow-sm">
                  <CheckCircle2 size={18} className="xs:w-5 xs:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs xs:text-sm">{t('invoices.documentedElectronicInvoice')}</span>
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
