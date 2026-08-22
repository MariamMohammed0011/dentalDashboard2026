import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  UserPlus,
  X,
  User,
  Phone,
  Building2,
  MapPin,
  Map,
  Globe
} from 'lucide-react';
import { useAddAdClient } from '../hooks/useAddAdClient';

const AddAdClientModal = ({ isOpen, onClose, onCreateClient, isSubmitting }) => {
  const { t } = useTranslation();

  const { form, handleChange, handleSubmit } = useAddAdClient({
    onCreateClient,
    onClose,
    isSubmitting
  });

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 xs:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl xs:rounded-3xl shadow-2xl w-full max-w-sm xs:max-w-md sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/60 dark:border-slate-700/60 relative my-auto"
          >

            <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/30 dark:from-slate-800/60 dark:via-slate-800/50 dark:to-slate-800/60 p-4 xs:p-5 sm:p-6 text-right flex items-start xs:items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 flex-shrink-0 gap-3 font-zain">
              <div className="flex items-start xs:items-center gap-2.5 xs:gap-3.5 flex-1 min-w-0">
                <div className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/15 text-blue-600 dark:text-blue-400 rounded-lg xs:rounded-xl sm:rounded-2xl border border-blue-200/60 dark:border-blue-800/40 shadow-sm shrink-0">
                  <UserPlus size={18} className="xs:w-6 xs:h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base xs:text-lg sm:text-xl font-black text-slate-900 dark:text-white break-words leading-tight">{t('ads.addClientModal.title')}</h3>
                  <p className="text-[11px] xs:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('ads.addClientModal.subtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 xs:p-2 hover:bg-slate-300/40 dark:hover:bg-slate-700 rounded-lg xs:rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                disabled={isSubmitting}
              >
                <X size={18} className="xs:w-5 xs:h-5" strokeWidth={2.5} />
              </button>
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden font-zain">

              <div className="p-4 xs:p-5 sm:p-6 sm:p-7 flex flex-col gap-3.5 xs:gap-4 sm:gap-5 text-right overflow-y-auto flex-grow custom-scrollbar">

                <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <User size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addClientModal.nameLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ads.addClientModal.namePlaceholder')}
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all w-full placeholder-slate-400/60"
                    disabled={isSubmitting}
                  />
                </div>


                <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      <Phone size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addClientModal.phoneLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09XXXXXXXX"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    maxLength="10"
                    inputMode="numeric"
                    className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all w-full text-right placeholder-slate-400/60"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <span className="text-[10px] xs:text-[11px] text-slate-500 dark:text-slate-400 mr-1 block mt-0.5 font-medium">
                    09 + 8 أرقام (مجموع 10 أرقام)
                  </span>
                </div>

                {/* <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex-shrink-0">
                      <Building2 size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addClientModal.facilityLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('ads.addClientModal.facilityPlaceholder')}
                    value={form.namePlace}
                    onChange={(e) => handleChange('namePlace', e.target.value)}
                    className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 dark:focus:border-purple-400 transition-all w-full placeholder-slate-400/60"
                    disabled={isSubmitting}
                  />
                </div> */}

                <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex-shrink-0">
                      <MapPin size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addClientModal.addressLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('ads.addClientModal.addressPlaceholder')}
                    value={form.addressPlace}
                    onChange={(e) => handleChange('addressPlace', e.target.value)}
                    className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 dark:focus:border-rose-400 transition-all w-full placeholder-slate-400/60"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-3.5 sm:gap-4">
                  <div className="flex flex-col gap-1.5 xs:gap-2">
                    <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                      <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex-shrink-0">
                        <Map size={14} className="xs:w-4 xs:h-4" />
                      </span>
                      {t('ads.addClientModal.cityLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('ads.addClientModal.cityPlaceholder')}
                      value={form.cityPlace}
                      onChange={(e) => handleChange('cityPlace', e.target.value)}
                      className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 dark:focus:border-amber-400 transition-all w-full placeholder-slate-400/60"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 xs:gap-2">
                    <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                      <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                        <Globe size={14} className="xs:w-4 xs:h-4" />
                      </span>
                      {t('ads.addClientModal.countryLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('ads.addClientModal.countryPlaceholder')}
                      value={form.countryPlace}
                      onChange={(e) => handleChange('countryPlace', e.target.value)}
                      className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all w-full placeholder-slate-400/60"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

              </div>


              <div className="flex gap-2 xs:gap-3 justify-end items-center p-3 xs:p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/40 dark:to-slate-800/20 border-t border-slate-200/60 dark:border-slate-700/60 flex-shrink-0 font-zain">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2 xs:py-2.5 sm:py-3 border-2 border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm rounded-lg xs:rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black text-xs xs:text-sm rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 xs:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('ads.addClientModal.submitting')}</span>
                    </>
                  ) : (
                    <span>{t('ads.addClientModal.submit')}</span>
                  )}
                </button>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddAdClientModal;