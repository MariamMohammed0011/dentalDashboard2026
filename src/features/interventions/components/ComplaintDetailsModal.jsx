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
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 font-zain" dir="rtl">
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
          className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col font-zain my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${destination === 'Lab' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'}`}>
                {destination === 'Lab' ? <FlaskConical size={24} className="text-amber-500" /> : <MessageSquare size={24} className="text-sky-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 font-zain">{t('interventions.modal.title', { id })}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${destination === 'Lab' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}>
                    {destination === 'Lab' ? t('interventions.modal.targetLabBadge') : t('interventions.modal.targetAdmin')}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                  <Clock size={13} className="text-indigo-500 dark:text-indigo-400" />
                  {t('orders.createdAt')}: {createdAtUtc ? new Date(createdAtUtc).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* User / Doctor Details Box */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={getFullImageUrl(user?.profilePictureUrl) || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
                alt={user?.name || t('doctors.doctor')}
                className="w-14 h-14 rounded-2xl object-cover border border-sky-500/20 shrink-0 shadow-xs"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150';
                }}
              />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 dark:text-slate-100 text-base truncate">{user?.name || t('orders.unknownDoctor')}</span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">{user?.role || t('membership.detailsModal.dentist')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-sky-500 shrink-0" />
                    <span className="truncate">{user?.namePlace || t('doctors.clinicName')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-emerald-500 shrink-0" />
                    <span className="dir-ltr text-right">{user?.phone || t('membership.detailsModal.notAvailable')}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <Mail size={14} className="text-purple-500 shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {destination === 'Lab' && targetLab && (
              <div className="bg-amber-500/[0.05] border border-amber-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <FlaskConical size={16} className="text-amber-500" />
                    {t('interventions.modal.targetLab', { id: targetLab.id })}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {targetLab.availability === 'Available' ? t('labs.detailsModal.availableForWork') : targetLab.availability || t('common.active')}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{targetLab.description || t('labs.detailsModal.labDescription')}</p>
                {Array.isArray(targetLab.specialties) && targetLab.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {targetLab.specialties.map((spec, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complaint Details Card */}
            <div className="space-y-2.5 bg-slate-50/60 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 block">{t('interventions.modal.subject')}:</span>
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100">{title || t('interventions.modal.noSubject')}</h4>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium shadow-2xs">
                {text || t('interventions.modal.noDetails')}
              </div>
            </div>

            {/* Reply Status or Input Card */}
            {isReplied ? (
              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    {t('interventions.modal.repliedByAdmin', { by: repliedBy || t('interventions.admin') })}
                  </span>
                  {repliedAtUtc && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {new Date(repliedAtUtc).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 border border-emerald-500/20 font-medium">
                  {reply}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReply} className="space-y-3 p-5 rounded-2xl bg-sky-50/40 dark:bg-slate-800/50 border border-sky-200/80 dark:border-slate-700/80 shadow-xs">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-black text-sm">
                  <MessageSquare size={16} className="text-sky-500" />
                  <label>{t('interventions.modal.replyLabel') || 'كتابة رد الإدارة وتحديث الشكوى:'}</label>
                </div>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('interventions.modal.replyPlaceholder') || 'اكتب نص الرد والتوضيح هنا ليتم إرساله في إشعار مباشر للطبيب...'}
                  className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none shadow-inner font-zain"
                  required
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyText.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-black text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={17} className={`text-white ${isReplying ? 'animate-spin' : ''}`} />
                  <span>{isReplying ? t('interventions.modal.sendingReply') || 'جاري إرسال الرد...' : t('interventions.modal.submitReply') || 'إرسال الرد وتحديث الشكوى'}</span>
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
