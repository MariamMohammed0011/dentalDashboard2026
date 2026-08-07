import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, DollarSign, UserCheck, Loader2, FlaskConical, 
  Search, ChevronDown, CheckCircle2, Building2 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionForm } from '../hooks/useSubscriptionForm';
import CalendarPicker from '../../../components/ui/CalendarPicker';

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

  const [isLabSelectOpen, setIsLabSelectOpen] = useState(false);
  const [labSearchQuery, setLabSearchQuery] = useState('');

  if (!isOpen) return null;

  const selectedLab = labs.find((l) => String(l.id) === String(selectedLabId));

  const filteredLabs = labs.filter((l) => {
    const labName = l.owner?.namePlace || l.name || '';
    const ownerName = l.owner?.name || '';
    const query = labSearchQuery.toLowerCase();
    return labName.toLowerCase().includes(query) || ownerName.toLowerCase().includes(query) || String(l.id).includes(query);
  });

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" dir="rtl">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)] overflow-hidden z-10 border border-slate-100 dark:border-slate-800"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white flex items-center justify-between overflow-hidden">
            <div className="z-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {type === 'renew' ? t('subscription.renewModalTitle') : type === 'activate' ? t('subscription.activateModalTitle') : t('subscription.addModalTitle')}
              </h2>
              {initialData?.labName ? (
                <p className="text-emerald-100 text-xs font-bold mt-1 flex items-center gap-1.5">
                  <Building2 size={13} />
                  <span>{t('subscription.labName')}: {initialData.labName}</span>
                </p>
              ) : (
                <p className="text-emerald-100/90 text-xs font-medium mt-1">
                  إدخال بيانات خطة الاشتراك وتحديد المخبر والمدة المالية
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all cursor-pointer z-10 hover:rotate-90 duration-300"
            >
              <X size={20} />
            </button>
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
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

            {/* Custom Searchable Select Lab (only for type === 'add') */}
            {type === 'add' && (
              <div className="flex flex-col gap-2 relative">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <UserCheck size={14} className="text-emerald-500" />
                  {t('subscription.selectLab')} <span className="text-rose-500">*</span>
                </label>

                {loadingLabs ? (
                  <div className="flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-text-muted">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                    <span>{t('subscription.loadingLabs')}</span>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsLabSelectOpen(!isLabSelectOpen)}
                      className={`w-full px-4 py-3.5 rounded-2xl border transition-all flex items-center justify-between text-right cursor-pointer ${
                        selectedLab
                          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-text-main dark:text-white"
                          : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-text-muted hover:border-emerald-400"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 ${selectedLab ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                          <FlaskConical size={18} />
                        </div>
                        {selectedLab ? (
                          <div className="flex flex-col min-w-0 text-right">
                            <span className="text-sm font-black truncate">{selectedLab.owner?.namePlace || selectedLab.name || `مخبر #${selectedLab.id}`}</span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                              رقم المعرف: #{selectedLab.id} {selectedLab.owner?.name ? `• ${selectedLab.owner.name}` : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-gray-400">{t('subscription.selectLabPlaceholder')}</span>
                        )}
                      </div>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isLabSelectOpen ? "rotate-180 text-emerald-500" : ""}`} />
                    </button>

                    {/* Floating Custom Dropdown List */}
                    <AnimatePresence>
                      {isLabSelectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 left-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden flex flex-col p-2 gap-2"
                        >
                          {/* Search Input inside List */}
                          <div className="relative p-1">
                            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="ابحث عن اسم المخبر أو صاحب العمل..."
                              value={labSearchQuery}
                              onChange={(e) => setLabSearchQuery(e.target.value)}
                              className="w-full pr-10 pl-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-text-main focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Options Scrollable List */}
                          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                            {filteredLabs.length > 0 ? (
                              filteredLabs.map((l) => {
                                const isSelected = String(l.id) === String(selectedLabId);
                                return (
                                  <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedLabId(l.id);
                                      setIsLabSelectOpen(false);
                                      setLabSearchQuery('');
                                    }}
                                    className={`flex items-center justify-between p-2.5 rounded-xl text-right transition-all duration-200 cursor-pointer ${
                                      isSelected
                                        ? "bg-emerald-500 text-white shadow-sm font-black"
                                        : "hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-text-main dark:text-gray-200 font-bold"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"}`}>
                                        <FlaskConical size={16} />
                                      </div>
                                      <div className="flex flex-col text-right min-w-0">
                                        <span className="text-xs sm:text-sm font-black truncate">{l.owner?.namePlace || l.name || `مخبر #${l.id}`}</span>
                                        <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-text-muted"}`}>
                                          #{l.id} {l.owner?.name ? `• ${l.owner.name}` : ""}
                                        </span>
                                      </div>
                                    </div>
                                    {isSelected && <CheckCircle2 size={18} className="text-white shrink-0" />}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="py-6 text-center text-xs text-text-muted font-bold">
                                لا توجد نتائج مطابقة لـ "{labSearchQuery}"
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* Amount / Price Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <DollarSign size={14} className="text-emerald-500" />
                {t('subscription.price')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder={t('subscription.pricePlaceholder')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-text-main dark:text-gray-100 text-sm font-black focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                  USD $
                </span>
              </div>
            </div>

            {/* Date Range Inputs with Dashboard's Custom CalendarPicker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <Calendar size={14} className="text-emerald-500" />
                  {t('subscription.startDate')} <span className="text-rose-500">*</span>
                </label>
                <CalendarPicker
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                  placeholder={t('subscription.startDate')}
                  className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-2xl py-3 px-4"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <Calendar size={14} className="text-emerald-500" />
                  {t('subscription.endDate')} <span className="text-rose-500">*</span>
                </label>
                <CalendarPicker
                  value={endDate}
                  onChange={(val) => setEndDate(val)}
                  placeholder={t('subscription.endDate')}
                  className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-2xl py-3 px-4"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-gray-300 transition-all active:scale-95 cursor-pointer text-center"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('subscription.saving')}</span>
                  </>
                ) : (
                  <span>{t('subscription.saveSubscription')}</span>
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
