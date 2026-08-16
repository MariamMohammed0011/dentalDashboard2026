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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
          >
            
            
            
            <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-primary/10 dark:from-slate-800 dark:to-slate-900 p-5 sm:p-6 text-right flex items-center justify-between border-b border-gray-100 dark:border-slate-700/80 flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20 shadow-xs shrink-0">
                  <UserPlus size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{t('ads.addClientModal.title')}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{t('ads.addClientModal.subtitle')}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

           
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              
             
              <div className="p-5 sm:p-7 flex flex-col gap-4.5 text-right overflow-y-auto flex-grow custom-scrollbar">
                
               
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      <User size={13} />
                    </span>
                    {t('ads.addClientModal.nameLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ads.addClientModal.namePlaceholder')}
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    disabled={isSubmitting}
                  />
                </div>

              
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Phone size={13} />
                    </span>
                    {t('ads.addClientModal.phoneLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ads.addClientModal.phonePlaceholder')}
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 mr-1 block mt-0.5">
                    {t('ads.addClientModal.phoneHint')}
                  </span>
                </div>

               
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <Building2 size={13} />
                    </span>
                    {t('ads.addClientModal.facilityLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('ads.addClientModal.facilityPlaceholder')}
                    value={form.namePlace}
                    onChange={(e) => handleChange('namePlace', e.target.value)}
                    className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    disabled={isSubmitting}
                  />
                </div>

                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                      <MapPin size={13} />
                    </span>
                    {t('ads.addClientModal.addressLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('ads.addClientModal.addressPlaceholder')}
                    value={form.addressPlace}
                    onChange={(e) => handleChange('addressPlace', e.target.value)}
                    className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    disabled={isSubmitting}
                  />
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        <Map size={13} />
                      </span>
                      {t('ads.addClientModal.cityLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('ads.addClientModal.cityPlaceholder')}
                      value={form.cityPlace}
                      onChange={(e) => handleChange('cityPlace', e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                        <Globe size={13} />
                      </span>
                      {t('ads.addClientModal.countryLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('ads.addClientModal.countryPlaceholder')}
                      value={form.countryPlace}
                      onChange={(e) => handleChange('countryPlace', e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

              </div>

              
              <div className="flex gap-3 justify-end items-center p-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-700/80 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#367AFF] hover:bg-[#2563EB] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? t('ads.addClientModal.submitting') : t('ads.addClientModal.submit')}
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