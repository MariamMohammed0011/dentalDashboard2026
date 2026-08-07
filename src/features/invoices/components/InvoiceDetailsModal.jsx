import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, Printer, CheckCircle2, Clock, Building2, User, Mail, Phone, MapPin, Tag,
  FileText, ShieldCheck, DollarSign, Image as ImageIcon, Calendar
} from 'lucide-react';
import logoImg from '../../../assets/logo.png';

export default function InvoiceDetailsModal({ isOpen, onClose, invoice }) {
  const { t } = useTranslation();

  if (typeof document === 'undefined') return null;
  if (!invoice) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white dark:bg-slate-950 w-full max-w-3xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-2 sm:my-6 border border-slate-100 dark:border-slate-800 flex flex-col text-right font-sans print:shadow-none print:border-none print:w-full print:max-w-none print:my-0"
          >
            {/* Modal Header Bar (Hidden in Print) */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">{t('invoices.invoiceDetailsTitle')} #{invoice.id}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{t('invoices.electronicInvoiceReceipt')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Printer size={15} />
                  <span>{t('invoices.printInvoice')}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Invoice Document Body */}
            <div className="p-6 sm:p-10 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible bg-white text-slate-900">
              
              {/* Header Invoice Meta */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                  <img src={logoImg} alt="Platform Logo" className="w-14 h-14 object-contain" />
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{t('invoices.dentalDigitalPlatform')}</h2>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">Dental Platform Advertising & Invoicing</p>
                  </div>
                </div>

                <div className="text-left sm:text-left dir-ltr w-full sm:w-auto flex flex-col items-end">
                  <span className="text-sm font-black text-slate-800">INVOICE #{invoice.id}</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black mt-1 ${
                    isPaid ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'
                  }`}>
                    {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    {isPaid ? t('invoices.paid') : t('invoices.unpaid')}
                  </span>
                </div>
              </div>

              {/* Client & Date Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                {/* Billing Info */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">{t('invoices.advertiserInfo')}</span>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    {invoice.userName || t('common.unknown')}
                  </h4>
                  {invoice.namePlace && (
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" />
                      {invoice.namePlace}
                    </p>
                  )}
                  {invoice.userEmail && (
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-2 dir-ltr text-right">
                      <Mail size={14} className="text-slate-400" />
                      {invoice.userEmail}
                    </p>
                  )}
                  {invoice.userPhone && (
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {invoice.userPhone}
                    </p>
                  )}
                  {(invoice.addressPlace || invoice.cityPlace || invoice.countryPlace) && (
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {[invoice.addressPlace, invoice.cityPlace, invoice.countryPlace].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>

                {/* Dates & Reference */}
                <div className="space-y-3 md:border-r md:border-slate-200 md:pr-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">{t('invoices.invoiceDetailsAndDates')}</span>
                  <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> {t('invoices.createdAt')}:</span>
                    <span className="font-black text-slate-800">{formatDate(invoice.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5"><Clock size={14} /> {t('invoices.expiresAt')}:</span>
                    <span className="font-black text-slate-800">{formatDate(invoice.expiresAt)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5"><Tag size={14} /> {t('invoices.target')}:</span>
                    <span className="font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg">{invoice.target || t('invoices.allCategories')}</span>
                  </div>
                </div>
              </div>

              {/* Advertisement / Service Details Table */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">{t('invoices.serviceDetails')}</span>
                
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                      <tr>
                        <th className="p-4">{t('invoices.descriptionAndTitle')}</th>
                        <th className="p-4">{t('invoices.target')}</th>
                        <th className="p-4 text-left">{t('invoices.amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-bold">
                      <tr>
                        <td className="p-4 space-y-1">
                          <span className="font-black text-sm text-slate-900 block">{invoice.title || t('invoices.paidAdOnPlatform')}</span>
                          {invoice.content && <p className="text-slate-500 text-xs font-semibold">{invoice.content}</p>}
                        </td>
                        <td className="p-4 text-slate-600">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 font-extrabold">
                            {invoice.target || t('common.all')}
                          </span>
                        </td>
                        <td className="p-4 text-left font-black text-base text-slate-900">
                          {Number(invoice.price || 0).toLocaleString()} {t('orders.currency')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="flex flex-col items-end border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between items-center w-full max-w-xs text-xs font-bold text-slate-600">
                  <span>{t('invoices.baseAmount')}:</span>
                  <span>{Number(invoice.price || 0).toLocaleString()} {t('orders.currency')}</span>
                </div>
                <div className="flex justify-between items-center w-full max-w-xs text-xs font-bold text-slate-600">
                  <span>{t('invoices.vat')}:</span>
                  <span>0 {t('orders.currency')}</span>
                </div>
                <div className="flex justify-between items-center w-full max-w-xs text-base font-black text-primary border-t border-slate-300 pt-2 mt-2">
                  <span>{t('invoices.grandTotal')}:</span>
                  <span className="text-xl">{Number(invoice.price || 0).toLocaleString()} {t('orders.currency')}</span>
                </div>
              </div>

              {/* Official Stamp & Note */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-bold">
                <p>{t('invoices.invoiceThankYou')}</p>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 font-black">
                  <CheckCircle2 size={16} />
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
