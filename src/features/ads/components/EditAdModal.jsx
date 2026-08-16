import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Megaphone,
  X,
  Image as ImageIcon,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import CalendarPicker from '../../../components/ui/CalendarPicker';
import TargetAudienceSelect from './TargetAudienceSelect';

const EditAdModal = ({ isOpen, onClose, ad, onUpdateAd, isSubmitting }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'dentists',
    expiresAt: '',
    image: null
  });

  useEffect(() => {
    if (ad && isOpen) {
      setForm({
        title: ad.title || '',
        content: ad.content || '',
        type: ad.type || 'dentists',
        expiresAt: ad.expiresAt || '',
        image: ad.image || null
      });
    }
  }, [ad, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error(t('ads.addAdForUserModal.titleRequired'));
      return;
    }

    onUpdateAd({
      title: form.title,
      content: form.content,
      type: form.type,
      expiresAt: form.expiresAt,
      image: form.image
    });
  };

  if (typeof document === 'undefined') return null;

  const getImagePreview = () => {
    if (!form.image) return null;
    if (form.image instanceof File) {
      return URL.createObjectURL(form.image);
    }
    return form.image;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && ad && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
          >
            
            
            <div className="bg-[#E8F1FF] p-5 sm:p-6 text-right flex items-center justify-between border-b border-[#D2E4FF]/50 flex-shrink-0">
              <div className="flex items-center gap-3 text-[#367AFF]">
                <Megaphone size={22} strokeWidth={2.5} />
                <h3 className="text-lg font-black">{t('ads.editAdModal.title')}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/50 rounded-xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

           
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              
              
              <div className="p-5 sm:p-7 flex flex-col gap-4 text-right overflow-y-auto flex-grow custom-scrollbar">
                
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Megaphone size={13} />
                    </span>
                    {t('ads.addAdForUserModal.titleLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ads.addAdForUserModal.titlePlaceholder')}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <FileText size={13} />
                    </span>
                    {t('ads.addAdForUserModal.contentLabel')}
                  </label>
                  <textarea
                    placeholder={t('ads.addAdForUserModal.contentPlaceholder')}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full min-h-[80px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        <Layers size={13} />
                      </span>
                      {t('ads.addAdForUserModal.audienceLabel')}
                    </label>
                    <TargetAudienceSelect
                      value={form.type}
                      onChange={(val) => setForm({ ...form, type: val })}
                      enabled={isOpen}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <Calendar size={13} />
                      </span>
                      {t('ads.addAdForUserModal.expiresLabel')}
                    </label>
                    <CalendarPicker
                      value={form.expiresAt}
                      onChange={(val) => setForm({ ...form, expiresAt: val })}
                      disabled={isSubmitting}
                      placeholder={t('ads.addAdForUserModal.expiresPlaceholder')}
                    />
                  </div>
                </div>

                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">{t('ads.addAdForUserModal.imageLabel')}</label>
                  <div className="flex flex-col items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-[#367AFF] transition-colors relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm({ ...form, image: file });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    {getImagePreview() ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100">
                        <img 
                          src={getImagePreview()} 
                          alt="Ad Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm">
                          {t('ads.addAdForUserModal.changeImage')}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon size={36} className="text-gray-300 group-hover:text-[#367AFF] transition-colors" />
                        <span className="text-xs font-semibold group-hover:text-[#367AFF] transition-colors">{t('ads.editAdModal.imagePrompt')}</span>
                        <span className="text-[10px] text-gray-400">{t('ads.addAdForUserModal.uploadFormats')}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

             
              <div className="flex gap-3 justify-end items-center p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-[#DBEAFE] bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? t('ads.editAdModal.saving') : t('ads.editAdModal.submit')}
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

export default EditAdModal;
