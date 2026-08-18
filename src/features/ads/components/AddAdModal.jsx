import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Megaphone,
  X,
  Image as ImageIcon,
  User,
  Search,
  ChevronDown,
  Calendar,
  Layers,
  FileText,
  Sparkles,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import CalendarPicker from '../../../components/ui/CalendarPicker';
import TargetAudienceSelect from './TargetAudienceSelect';
import { usersApi } from '../services/usersApi';

const AddAdModal = ({ isOpen, onClose, onCreateAd, isSubmitting }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'dentists',
    expiresAt: '',
    image: null
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: '',
        content: '',
        type: 'dentists',
        expiresAt: '',
        image: null
      });
      setSelectedUser(null);
      setUserSearch('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['ads-users-list'],
    queryFn: () => usersApi.getUsers(),
    enabled: isOpen,
  });

  const filteredUsers = users.filter(user => {
    const isSystemAdmin = 
      user.role?.toLowerCase() === 'systemadmin' || 
      user.role?.toLowerCase() === 'admin' || 
      user.name === 'System Admin' ||
      user.role === 'مسؤول النظام';

    if (isSystemAdmin) return false;

    const q = userSearch.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(q) ||
      (user.phone || '').includes(q) ||
      (user.namePlace || '').toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error(t('ads.addAdModal.userRequired'));
      return;
    }
    if (!form.title.trim()) {
      toast.error(t('ads.addAdForUserModal.titleRequired'));
      return;
    }
    if (!form.image) {
      toast.error(t('ads.addAdForUserModal.imageRequired'));
      return;
    }

    onCreateAd({
      userId: selectedUser.id,
      adData: form
    }, {
      onSuccess: () => {
        toast.success(t('ads.addAdModal.successToast'));
        onClose();
      },
      onError: (error) => {
        console.error("Failed to create ad:", error);
        const serverMessage = error.response?.data?.message || t('ads.addAdModal.errorFallback');
        toast.error(serverMessage);
      }
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 xs:p-4 bg-black/70 backdrop-blur-md overflow-y-auto font-zain" dir="rtl">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-2xl xs:rounded-3xl shadow-2xl w-full max-w-sm xs:max-w-md sm:max-w-lg max-h-[92vh] flex flex-col overflow-hidden border border-slate-200/60 dark:border-slate-700/60 relative my-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/30 dark:from-slate-800/60 dark:via-slate-800/50 dark:to-slate-800/60 p-4 xs:p-5 sm:p-6 text-right flex items-start xs:items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 flex-shrink-0 gap-3">
              <div className="flex items-start xs:items-center gap-2.5 xs:gap-3.5 flex-1 min-w-0">
                <div className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg xs:rounded-xl sm:rounded-2xl border border-blue-200/60 dark:border-blue-800/40 shadow-sm shrink-0">
                  <Megaphone size={18} className="xs:w-6 xs:h-6 sm:w-7 sm:h-7 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base xs:text-lg sm:text-xl font-black text-slate-900 dark:text-white break-words leading-tight">{t('ads.addAdForUserModal.title')}</h3>
                  <p className="text-[11px] xs:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('ads.addAdModal.subtitle')}</p>
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

                <div className="flex flex-col gap-1.5 xs:gap-2 relative">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <User size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addAdModal.userLabel')} <span className="text-red-500">*</span>
                  </label>

                  {selectedUser ? (
                    <div className="flex items-center justify-between gap-2 xs:gap-3 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border-2 border-blue-200/60 dark:border-blue-800/40 rounded-lg xs:rounded-xl sm:rounded-2xl p-2.5 xs:p-3 sm:p-3.5 transition-all">
                      <div className="flex items-center gap-2 xs:gap-3 text-right flex-1 min-w-0">
                        <div className="p-1.5 xs:p-2 bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg xs:rounded-lg border border-blue-200/60 dark:border-blue-800/40 shrink-0">
                          <User size={16} className="xs:w-5 xs:h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs xs:text-sm font-black text-slate-900 dark:text-white truncate">{selectedUser.name}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setUserSearch('');
                        }}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors cursor-pointer shrink-0"
                        disabled={isSubmitting}
                      >
                        <X size={14} className="xs:w-4 xs:h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={isLoadingUsers ? t('ads.addAdModal.loadingUsers') : t('ads.addAdModal.searchUserPlaceholder')}
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        disabled={isLoadingUsers || isSubmitting}
                        className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl pr-10 xs:pr-11 pl-9 xs:pl-10 py-2.5 xs:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all w-full text-right placeholder-slate-400/60"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-blue-500/10 text-blue-500 pointer-events-none">
                        <Search size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isLoadingUsers || isSubmitting}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors cursor-pointer"
                      >
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                     
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-[9998]" 
                              onClick={() => setIsDropdownOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-border-main rounded-2xl shadow-xl z-[9999] max-h-60 overflow-y-auto custom-scrollbar"
                            >
                              {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                  <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsDropdownOpen(false);
                                      setUserSearch('');
                                    }}
                                    className="w-full text-right px-4 py-3 hover:bg-blue-500/10 flex items-center justify-between border-b border-border-main/50 last:border-0 transition-colors cursor-pointer"
                                  >
                                    <div className="text-sm font-bold text-text-main truncate">{user.name}</div>
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                                      <User size={14} />
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-text-muted text-sm font-bold">
                                  {t('ads.addAdModal.noUsersFound')}
                                </div>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex-shrink-0">
                      <Megaphone size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addAdForUserModal.titleLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('ads.addAdForUserModal.titlePlaceholder')}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 dark:focus:border-amber-400 transition-all w-full placeholder-slate-400/60"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex-shrink-0">
                      <FileText size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addAdForUserModal.contentLabel')}
                  </label>
                  <textarea
                    placeholder={t('ads.addAdForUserModal.contentPlaceholder')}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-slate-800 dark:text-slate-100 font-semibold text-xs xs:text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 dark:focus:border-purple-400 transition-all w-full min-h-[75px] xs:min-h-[85px] resize-none placeholder-slate-400/60"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-3.5 sm:gap-4">
                  <div className="flex flex-col gap-1.5 xs:gap-2">
                    <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                      <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                        <Layers size={14} className="xs:w-4 xs:h-4" />
                      </span>
                      {t('ads.addAdForUserModal.audienceLabel')}
                    </label>
                    <TargetAudienceSelect
                      value={form.type}
                      onChange={(val) => setForm({ ...form, type: val })}
                      enabled={isOpen}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 xs:gap-2">
                    <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                      <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex-shrink-0">
                        <Calendar size={14} className="xs:w-4 xs:h-4" />
                      </span>
                      {t('ads.addAdForUserModal.expiresLabel')}
                    </label>
                    <div className="relative">
                      <CalendarPicker
                        value={form.expiresAt}
                        onChange={(val) => setForm({ ...form, expiresAt: val })}
                        disabled={isSubmitting}
                        placeholder={t('ads.addAdForUserModal.expiresPlaceholder')}
                        className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 xs:gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-black text-xs xs:text-sm flex items-center gap-1.5 xs:gap-2 mr-1">
                    <span className="p-1 xs:p-1.5 rounded-lg xs:rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex-shrink-0">
                      <ImageIcon size={14} className="xs:w-4 xs:h-4" />
                    </span>
                    {t('ads.addAdForUserModal.imageLabel')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col items-center gap-2.5 xs:gap-3 bg-gradient-to-br from-teal-50/40 to-slate-50/40 dark:from-teal-900/10 dark:to-slate-800/40 border-2 border-dashed border-teal-400/40 dark:border-teal-700/40 hover:border-teal-500 dark:hover:border-teal-500 rounded-xl xs:rounded-2xl sm:rounded-3xl p-3.5 xs:p-4 sm:p-5 transition-all relative cursor-pointer group">
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
                      <div className="relative w-full aspect-video rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                        <img
                          src={URL.createObjectURL(form.image)}
                          alt="Ad Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-black text-xs xs:text-sm gap-1.5 xs:gap-2">
                          <UploadCloud size={18} className="xs:w-5 xs:h-5" />
                          <span>{t('ads.addAdForUserModal.changeImage')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 xs:gap-2 text-slate-500 dark:text-slate-400 py-1.5 xs:py-2">
                        <div className="p-2.5 xs:p-3.5 rounded-lg xs:rounded-2xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
                          <UploadCloud size={24} className="xs:w-8 xs:h-8" />
                        </div>
                        <span className="text-[11px] xs:text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-center">
                          {t('ads.addAdForUserModal.uploadPrompt')}
                        </span>
                        <span className="text-[10px] xs:text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('ads.addAdForUserModal.uploadFormats')}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex gap-2 xs:gap-3 justify-end items-center p-3 xs:p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/40 dark:to-slate-800/20 border-t border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2 xs:py-2.5 sm:py-3 border-2 border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-lg xs:rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50 text-xs xs:text-sm"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 xs:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('ads.addAdForUserModal.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="xs:w-[18px] xs:h-[18px]" />
                      <span>{t('ads.addAdForUserModal.submit')}</span>
                    </>
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

export default AddAdModal;

