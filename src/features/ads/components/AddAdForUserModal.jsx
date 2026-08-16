import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Megaphone,
  X,
  CheckCircle,
  Image as ImageIcon,
  Calendar,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import CalendarPicker from '../../../components/ui/CalendarPicker';
import TargetAudienceSelect from './TargetAudienceSelect';

const AddAdForUserModal = ({ isOpen, onClose, onCreateAd, user, isSubmitting }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'dentists',
    expiresAt: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error(t('ads.addAdForUserModal.titleRequired'));
      return;
    }
    if (!form.image) {
      toast.error(t('ads.addAdForUserModal.imageRequired'));
      return;
    }

    try {
      await onCreateAd(form);
      setForm({
        title: '',
        content: '',
        type: 'dentists',
        expiresAt: '',
        image: null
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md" dir="rtl">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-bg-card rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-border-main/80 relative"
          >
           
            <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-primary/10 dark:from-slate-800 dark:to-slate-900 p-5 sm:p-6 text-right flex items-center justify-between border-b border-border-main/60 flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-gradient-to-br from-primary/20 via-blue-500/20 to-indigo-500/20 text-primary rounded-2xl border border-primary/20 shadow-sm shrink-0">
                  <Megaphone size={22} className="text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-text-main">{t('ads.addAdForUserModal.title')}</h3>
                  {user && (
                    <p className="text-xs text-text-muted font-medium mt-0.5">
                      {t('ads.addAdForUserModal.forClientPrefix')} <strong className="font-bold text-primary">{user.name}</strong> {t('ads.addAdForUserModal.forClientSuffix', { phone: user.phone })}
                    </p>
                  )}
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-2xl text-text-muted hover:text-text-main transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

           
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-5 sm:p-6 flex flex-col gap-4.5 text-right overflow-y-auto flex-grow custom-scrollbar">
                
               
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Megaphone size={14} />
                    </span>
                    {t('ads.addAdForUserModal.titleLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ads.addAdForUserModal.titlePlaceholder')}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-gray-50 dark:bg-slate-900 border-2 border-border-main/70 focus:border-amber-500 rounded-2xl px-4 py-3 text-text-main font-medium text-sm focus:outline-none transition-colors w-full"
                    disabled={isSubmitting}
                  />
                </div>

              
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <FileText size={14} />
                    </span>
                    {t('ads.addAdForUserModal.contentLabel')}
                  </label>
                  <textarea
                    placeholder={t('ads.addAdForUserModal.contentPlaceholder')}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="bg-gray-50 dark:bg-slate-900 border-2 border-border-main/70 focus:border-purple-500 rounded-2xl px-4 py-3 text-text-main font-medium text-sm focus:outline-none transition-colors w-full min-h-[85px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <Layers size={14} />
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
                    <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                        <Calendar size={14} />
                      </span>
                      {t('ads.addAdForUserModal.expiresLabel')}
                    </label>
                    <div className="relative">
                      <CalendarPicker
                        value={form.expiresAt}
                        onChange={(val) => setForm({ ...form, expiresAt: val })}
                        disabled={isSubmitting}
                        placeholder={t('ads.addAdForUserModal.expiresPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400">
                      <ImageIcon size={14} />
                    </span>
                    {t('ads.addAdForUserModal.imageLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-col items-center gap-3 bg-slate-50 dark:bg-slate-900/60 border-2 border-dashed border-teal-500/30 hover:border-teal-500 rounded-3xl p-5 transition-colors relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm({ ...form, image: file });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={isSubmitting}
                    />
                    {form.image ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border-main/80 shadow-sm">
                        <img 
                          src={URL.createObjectURL(form.image)} 
                          alt="Ad Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm gap-2">
                          <UploadCloud size={20} />
                          <span>{t('ads.addAdForUserModal.changeImage')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-muted py-2">
                        <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
                          <UploadCloud size={32} />
                        </div>
                        <span className="text-xs font-bold text-text-main group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {t('ads.addAdForUserModal.uploadPrompt')}
                        </span>
                        <span className="text-[11px] text-text-muted font-medium">{t('ads.addAdForUserModal.uploadFormats')}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              
              <div className="flex gap-3 justify-end items-center p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-border-main/60 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border-2 border-border-main bg-white dark:bg-bg-card text-text-muted font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
                >
                  <CheckCircle2 size={18} />
                  <span>{isSubmitting ? t('ads.addAdForUserModal.submitting') : t('ads.addAdForUserModal.submit')}</span>
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

export default AddAdForUserModal;

