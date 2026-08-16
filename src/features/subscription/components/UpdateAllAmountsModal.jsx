import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';

export default function UpdateAllAmountsModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError(t('subscription.updateAllAmountsModal.invalidAmount'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(Number(amount));
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || t('subscription.updateAllAmountsModal.updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" dir="rtl">
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)] overflow-hidden z-10 border border-slate-100 dark:border-slate-800"
        >
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white flex items-center justify-between overflow-hidden">
            <div className="z-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{t('subscription.updateAllAmountsModal.title')}</h2>
              <p className="text-emerald-100/90 text-xs font-medium mt-1">
                {t('subscription.updateAllAmountsModal.subtitle')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all cursor-pointer z-10 hover:rotate-90 duration-300"
            >
              <X size={20} />
            </button>
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                {t('subscription.updateAllAmountsModal.warningNotice')}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold rounded-2xl border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <DollarSign size={14} className="text-emerald-500" />
                {t('subscription.updateAllAmountsModal.amountLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  autoFocus
                  required
                  placeholder={t('subscription.updateAllAmountsModal.amountPlaceholder')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-text-main dark:text-gray-100 text-sm font-black focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                  USD $
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-3 sm:px-4 rounded-2xl text-[11px] sm:text-sm font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-gray-300 transition-all active:scale-95 cursor-pointer text-center whitespace-nowrap"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-3 sm:px-4 rounded-2xl text-[11px] sm:text-sm font-black bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin shrink-0" />
                    <span>{t('subscription.saving')}</span>
                  </>
                ) : (
                  <span>{t('subscription.updateAllAmountsModal.confirmButton')}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
