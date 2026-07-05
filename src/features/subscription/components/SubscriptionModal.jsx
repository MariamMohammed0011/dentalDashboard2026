import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, UserCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionForm } from '../hooks/useSubscriptionForm';

export default function SubscriptionModal({ isOpen, onClose, onSubmit, type, initialData }) {
  const { t } = useTranslation();
  const {
    labs,
    loadingLabs,
    selectedLabId,
    setSelectedLabId,
    amount,
    setAmount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSubmitting,
    error,
    handleSubmit,
  } = useSubscriptionForm({ isOpen, type, initialData, onSubmit, onClose });

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" dir="rtl">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden z-10 border border-slate-100 dark:border-slate-800"
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                {type === 'renew' ? 'تجديد اشتراك المخبر' : type === 'activate' ? 'تفعيل اشتراك المخبر' : 'إضافة اشتراك لمخبر'}
              </h2>
              {initialData?.labName && (
                <p className="text-white/80 text-xs font-bold mt-1">
                  المخبر: {initialData.labName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-2xl border border-rose-100 dark:border-rose-900/30">
                {error}
              </div>
            )}

            {/* Select Lab (only for type === 'add') */}
            {type === 'add' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <UserCheck size={14} className="text-emerald-500" />
                  اختر المخبر <span className="text-rose-500">*</span>
                </label>
                {loadingLabs ? (
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Loader2 size={16} className="animate-spin" />
                    جاري تحميل المخابر...
                  </div>
                ) : (
                  <select
                    value={selectedLabId}
                    onChange={(e) => setSelectedLabId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-text-main dark:text-gray-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">-- اختر المخبر من القائمة --</option>
                    {labs.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.owner?.namePlace || l.name || `مخبر رقم #${l.id}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Amount */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign size={14} className="text-emerald-500" />
                قيمة الاشتراك (بالريال) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="أدخل قيمة الاشتراك..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-text-main dark:text-gray-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-500" />
                  تاريخ البدء <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-text-main dark:text-gray-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-500" />
                  تاريخ الانتهاء <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-text-main dark:text-gray-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl text-sm font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-gray-300 transition-all active:scale-95 cursor-pointer text-center"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-2xl text-sm font-black bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ الاشتراك'
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
