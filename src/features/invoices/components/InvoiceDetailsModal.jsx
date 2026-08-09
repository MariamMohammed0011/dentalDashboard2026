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
            className="relative bg-white dark:bg-slate-950 w-full max-w-3xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-2 sm:my-6 border border-border-main flex flex-col text-right font-zain select-none print:shadow-none print:border-none print:w-full print:max-w-none print:my-0"
          >
            {/* Modal Header Bar (Hidden in Print) */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-700/60 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm shrink-0">
                  <ShieldCheck size={24} className="text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black tracking-tight font-zain">{t('invoices.invoiceDetailsTitle')} #{invoice.id}</h3>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30">
                      {invoice.categoryLabel || 'فاتورة رسمية'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium font-zain mt-0.5">{t('invoices.electronicInvoiceReceipt')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                >
                  <Printer size={15} />
                  <span>{t('invoices.printInvoice')}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Invoice Document Body */}
            <div className="p-5 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible bg-white dark:bg-slate-900 text-text-main font-zain">
              
              {/* Top Branding & Invoice Status Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-main/60 pb-6">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                    <img src={logoImg} alt="Platform Logo" className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-text-main tracking-tight">{t('invoices.dentalDigitalPlatform')}</h2>
                    <p className="text-xs text-text-muted font-bold mt-0.5">Dental Platform Advertising & Invoicing System</p>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between sm:justify-center items-end w-full sm:w-auto border-t sm:border-t-0 border-border-main/50 pt-3 sm:pt-0">
                  <span className="text-sm font-black text-text-main uppercase tracking-wider dir-ltr">
                    INVOICE #{invoice.id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black mt-1 border ${
                    isPaid 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-2xs' 
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-2xs'
                  }`}>
                    {isPaid ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Clock size={14} className="text-rose-500" />}
                    {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                  </span>
                </div>
              </div>

              {/* Grid Section 1: Client Info & Invoice Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/80 dark:bg-slate-800/40 p-5 rounded-3xl border border-border-main/80">
                {/* Billing Info */}
                <div className="space-y-2.5">
                  <span className="text-xs font-black text-text-muted uppercase tracking-wider block font-zain">
                    {t('invoices.advertiserInfo')}
                  </span>
                  <h4 className="text-base font-black text-text-main flex items-center gap-2">
                    <User size={18} className="text-primary shrink-0" />
                    <span>{invoice.userName || t('common.unknown')}</span>
                  </h4>

                  <div className="space-y-1.5 text-xs text-text-muted font-bold">
                    {invoice.namePlace && (
                      <p className="flex items-center gap-2 text-text-main">
                        <Building2 size={15} className="text-sky-500 shrink-0" />
                        <span>{invoice.namePlace}</span>
                      </p>
                    )}
                    {invoice.userEmail && (
                      <p className="flex items-center gap-2 text-text-muted dir-ltr text-right">
                        <Mail size={15} className="text-purple-500 shrink-0" />
                        <span>{invoice.userEmail}</span>
                      </p>
                    )}
                    {invoice.userPhone && (
                      <p className="flex items-center gap-2">
                        <Phone size={15} className="text-emerald-500 shrink-0" />
                        <span className="dir-ltr text-right">{invoice.userPhone}</span>
                      </p>
                    )}
                    {(invoice.addressPlace || invoice.cityPlace || invoice.countryPlace) && (
                      <p className="flex items-center gap-2">
                        <MapPin size={15} className="text-rose-500 shrink-0" />
                        <span>{[invoice.addressPlace, invoice.cityPlace, invoice.countryPlace].filter(Boolean).join(', ')}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates & Target Reference */}
                <div className="space-y-3 md:border-r md:border-border-main/60 md:pr-6 pt-3 md:pt-0 border-t md:border-t-0 border-border-main/40">
                  <span className="text-xs font-black text-text-muted uppercase tracking-wider block font-zain">
                    {t('invoices.invoiceDetailsAndDates')}
                  </span>

                  <div className="flex justify-between items-center text-xs font-bold border-b border-border-main/40 pb-2">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <Calendar size={14} className="text-emerald-500" />
                      {t('invoices.createdAt')}:
                    </span>
                    <span className="font-black text-text-main">{formatDate(invoice.createdAt)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold border-b border-border-main/40 pb-2">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-500" />
                      {t('invoices.expiresAt')}:
                    </span>
                    <span className="font-black text-text-main">{formatDate(invoice.expiresAt)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <Tag size={14} className="text-blue-500" />
                      {t('invoices.target')}:
                    </span>
                    <span className="font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg">
                      {invoice.target || t('invoices.allCategories')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service / Item Breakdown Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Tag size={15} />
                  </div>
                  <span className="text-sm font-black text-text-main uppercase tracking-wider font-zain">
                    {t('invoices.serviceDetails')}
                  </span>
                </div>
                
                <div className="border border-border-main/80 rounded-2xl overflow-hidden shadow-2xs bg-white dark:bg-slate-900">
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
              </div>

              {/* Financial Totals Card */}
              <div className="bg-gradient-to-br from-slate-50 via-slate-50/80 to-primary/5 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-800 p-5 rounded-3xl border border-border-main/80 shadow-sm space-y-3 max-w-md ml-0 mr-auto w-full">
                <div className="flex justify-between items-center text-xs font-bold text-text-muted border-b border-border-main/40 pb-2">
                  <span>{t('invoices.baseAmount')}:</span>
                  <span className="font-black text-text-main text-sm">{Number(invoice.price || 0).toLocaleString()} <span className="text-xs font-bold text-text-muted">ر.س</span></span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-text-muted border-b border-border-main/40 pb-2">
                  <span>{t('invoices.vat')} (%0):</span>
                  <span className="font-black text-text-main text-sm">0 <span className="text-xs font-bold text-text-muted">ر.س</span></span>
                </div>

                {/* Highlighted Grand Total Box */}
                <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white shadow-lg shadow-primary/20 rounded-2xl p-4 flex justify-between items-center border border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 shrink-0">
                      <DollarSign size={20} className="text-white" />
                    </div>
                    <span className="font-black text-base font-zain tracking-wide">{t('invoices.grandTotal')}:</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black dir-ltr font-zain tracking-tight">
                    {Number(invoice.price || 0).toLocaleString()} <span className="text-xs font-bold opacity-90">ر.س</span>
                  </span>
                </div>
              </div>

              {/* Official Documented Verification Footer */}
              <div className="pt-4 border-t border-border-main/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-text-muted font-bold">
                <p className="text-center sm:text-right">{t('invoices.invoiceThankYou')}</p>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 font-black shadow-2xs shrink-0">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>{t('invoices.documentedElectronicInvoice')}</span>
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
