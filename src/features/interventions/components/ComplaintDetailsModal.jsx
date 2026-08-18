import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Send, Building2, Phone, Mail, Clock, MessageSquare, ShieldCheck, FlaskConical } from 'lucide-react';

export default function ComplaintDetailsModal({ complaint, onClose, onSendReply, isReplying }) {
  const { t } = useTranslation();
  const [replyText, setReplyText] = useState('');

  if (!complaint) return null;

  const {
    id,
    destination,
    title,
    text,
    userId,
    user,
    targetLab,
    createdAtUtc,
    reply,
    repliedAtUtc,
    repliedBy
  } = complaint;

  const isReplied = Boolean(reply || repliedAtUtc);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await onSendReply({
      userId: userId || user?.id,
      complaintId: id,
      replyText: replyText.trim()
    });
    setReplyText('');
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://localhost:44334/${path.replace(/^\//, '')}`;
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 xs:p-3 sm:p-6 font-zain" dir="rtl">
        {/* Full Viewport & Sidebar Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-lg xs:max-w-xl sm:max-w-2xl max-h-[95vh] xs:max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl sm:rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col font-zain my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2.5 xs:p-3.5 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 gap-2">
            <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
              <div className={`p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl sm:rounded-2xl shrink-0 ${destination === 'Lab' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'}`}>
                {destination === 'Lab' ? <FlaskConical size={18} className="xs:w-6 xs:h-6 sm:w-6 sm:h-6 text-amber-500" /> : <MessageSquare size={18} className="xs:w-6 xs:h-6 sm:w-6 sm:h-6 text-sky-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm xs:text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-zain truncate">{t('interventions.modal.title', { id })}</h3>
                  <span className={`text-[10px] xs:text-xs font-bold px-1.5 xs:px-2.5 py-0.5 rounded-full shrink-0 ${destination === 'Lab' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}>
                    {destination === 'Lab' ? t('interventions.modal.targetLabBadge') : t('interventions.modal.targetAdmin')}
                  </span>
                </div>
                <span className="text-[10px] xs:text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                  <Clock size={11} className="xs:w-3 xs:h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                  {createdAtUtc ? new Date(createdAtUtc).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
            >
              <X size={16} className="xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          <div className="p-3 xs:p-4 sm:p-6 overflow-y-auto space-y-3 xs:space-y-4 sm:space-y-5 flex-1 custom-scrollbar">
            {/* User / Doctor Details Box */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-lg xs:rounded-xl sm:rounded-2xl p-2.5 xs:p-3.5 sm:p-4.5 flex flex-col xs:flex-row items-start xs:items-center gap-2.5 xs:gap-3 sm:gap-4">
              <img
                src={getFullImageUrl(user?.profilePictureUrl) || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
                alt={user?.name || t('doctors.doctor')}
                className="w-12 xs:w-12 sm:w-14 h-12 xs:h-12 sm:h-14 rounded-lg xs:rounded-xl sm:rounded-2xl object-cover border border-sky-500/20 shrink-0 shadow-xs"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150';
                }}
              />
              <div className="flex-1 space-y-1 xs:space-y-1.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm xs:text-base truncate">{user?.name || t('orders.unknownDoctor')}</span>
                  <span className="text-[10px] xs:text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 xs:px-2.5 py-0.5 rounded-full shrink-0">{user?.role || t('membership.detailsModal.dentist')}</span>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-3 xs:gap-x-4 gap-y-1 xs:gap-y-1.5 text-[10px] xs:text-xs text-slate-500 dark:text-slate-400 font-bold">
                  <div className="flex items-center gap-1">
                    <Building2 size={12} className="xs:w-3.5 xs:h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{user?.namePlace || t('doctors.clinicName')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={12} className="xs:w-3.5 xs:h-3.5 text-emerald-500 shrink-0" />
                    <span className="dir-ltr text-right truncate">{user?.phone || t('membership.detailsModal.notAvailable')}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center gap-1 xs:col-span-2">
                      <Mail size={12} className="xs:w-3.5 xs:h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate text-[10px] xs:text-xs">{user?.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {destination === 'Lab' && targetLab && (
              <div className="bg-amber-500/[0.05] border border-amber-500/20 rounded-lg xs:rounded-xl sm:rounded-2xl p-2.5 xs:p-3.5 sm:p-4 space-y-1.5 xs:space-y-2 sm:space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] xs:text-xs sm:text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <FlaskConical size={14} className="xs:w-4 xs:h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{t('interventions.modal.targetLab', { id: targetLab.id })}</span>
                  </span>
                  <span className="text-[9px] xs:text-[11px] font-bold px-1.5 xs:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {targetLab.availability === 'Available' ? t('labs.detailsModal.availableForWork') : targetLab.availability || t('common.active')}
                  </span>
                </div>
                <p className="text-[10px] xs:text-xs font-medium text-slate-800 dark:text-slate-200">{targetLab.description || t('labs.detailsModal.labDescription')}</p>
                {Array.isArray(targetLab.specialties) && targetLab.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {targetLab.specialties.map((spec, i) => (
                      <span key={i} className="text-[9px] xs:text-[11px] font-bold px-1.5 xs:px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complaint Details Card */}
            <div className="space-y-1.5 xs:space-y-2 sm:space-y-2.5 bg-slate-50/60 dark:bg-slate-800/30 p-2.5 xs:p-3.5 sm:p-4 rounded-lg xs:rounded-xl sm:rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] xs:text-xs font-bold text-slate-400 block">{t('interventions.modal.subject')}:</span>
              <h4 className="text-sm xs:text-base font-black text-slate-900 dark:text-slate-100">{title || t('interventions.modal.noSubject')}</h4>
              <div className="p-2.5 xs:p-3.5 sm:p-4 rounded-lg xs:rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs xs:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium shadow-2xs max-h-36 xs:max-h-48 overflow-y-auto">
                {text || t('interventions.modal.noDetails')}
              </div>
            </div>

            {/* Reply Status or Input Card */}
            {isReplied ? (
              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg xs:rounded-xl sm:rounded-2xl p-2.5 xs:p-3.5 sm:p-4 space-y-1.5 xs:space-y-2 sm:space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] xs:text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={14} className="xs:w-4 xs:h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{t('interventions.modal.repliedByAdmin', { by: repliedBy || t('interventions.admin') })}</span>
                  </span>
                  {repliedAtUtc && (
                    <span className="text-[9px] xs:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {new Date(repliedAtUtc).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  )}
                </div>
                <div className="p-2 xs:p-3.5 sm:p-3.5 rounded-lg xs:rounded-xl bg-white dark:bg-slate-900 text-xs xs:text-sm text-slate-800 dark:text-slate-200 border border-emerald-500/20 font-medium max-h-32 xs:max-h-48 overflow-y-auto">
                  {reply}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReply} className="space-y-2 xs:space-y-2.5 sm:space-y-3 p-2.5 xs:p-3.5 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-2xl bg-sky-50/40 dark:bg-slate-800/50 border border-sky-200/80 dark:border-slate-700/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 font-black text-xs xs:text-sm">
                  <MessageSquare size={14} className="xs:w-4 xs:h-4 text-sky-500 shrink-0" />
                  <label className="truncate">{t('interventions.modal.replyLabel') || 'كتابة رد الإدارة:'}</label>
                </div>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('interventions.modal.replyPlaceholder') || 'اكتب الرد هنا...'}
                  className="w-full p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-lg sm:rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs xs:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none shadow-inner font-zain"
                  required
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyText.trim()}
                  className="w-full py-2 xs:py-2.5 sm:py-3.5 px-3 xs:px-4 sm:px-6 rounded-lg xs:rounded-lg sm:rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-black text-xs xs:text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 xs:gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={14} className={`xs:w-4 xs:h-4 text-white ${isReplying ? 'animate-spin' : ''}`} />
                  <span>{isReplying ? t('interventions.modal.sendingReply') || 'إرسال...' : t('interventions.modal.submitReply') || 'إرسال الرد'}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
