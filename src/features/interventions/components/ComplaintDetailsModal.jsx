import React, { useState } from 'react';
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-bg-card border border-border-main rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-main/60 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${destination === 'Lab' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                {destination === 'Lab' ? <FlaskConical size={24} /> : <MessageSquare size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-text-main">{t('interventions.modal.title', { id })}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    destination === 'Lab' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary'
                  }`}>
                    {destination === 'Lab' ? t('interventions.modal.targetLabBadge') : t('interventions.modal.targetAdmin')}
                  </span>
                </div>
                <span className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                  <Clock size={12} />
                  {t('orders.createdAt')}: {createdAtUtc ? new Date(createdAtUtc).toLocaleString('ar-EG') : ''}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* User (Doctor) Info Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={getFullImageUrl(user?.profilePictureUrl) || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
                alt={user?.name || t('doctors.doctor')}
                className="w-14 h-14 rounded-2xl object-cover border border-primary/20 shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150';
                }}
              />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-text-main text-base truncate">{user?.name || t('orders.unknownDoctor')}</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t('membership.detailsModal.dentist')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{user?.namePlace || t('doctors.clinicName')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="dir-ltr text-right">{user?.phone || t('membership.detailsModal.notAvailable')}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Target Lab Info (If destination === 'Lab') */}
            {destination === 'Lab' && targetLab && (
              <div className="bg-amber-500/[0.05] border border-amber-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <FlaskConical size={16} />
                    {t('interventions.modal.targetLab', { id: targetLab.id })}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {targetLab.availability === 'Available' ? t('labs.detailsModal.availableForWork') : targetLab.availability || t('common.active')}
                  </span>
                </div>
                <p className="text-xs font-medium text-text-main">{targetLab.description || t('labs.detailsModal.labDescription')}</p>
                {Array.isArray(targetLab.specialties) && targetLab.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {targetLab.specialties.map((spec, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complaint Text */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-muted">{t('interventions.modal.subject')}</span>
              <h4 className="text-base font-black text-text-main">{title || t('interventions.modal.noSubject')}</h4>
              <div className="p-4 rounded-2xl bg-bg-card border border-border-main text-sm text-text-main leading-relaxed whitespace-pre-wrap">
                {text || t('interventions.modal.noDetails')}
              </div>
            </div>

            {/* Existing Reply or New Reply Form */}
            {isReplied ? (
              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={16} />
                    {t('interventions.modal.repliedByAdmin', { by: repliedBy || t('interventions.admin') })}
                  </span>
                  {repliedAtUtc && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      {new Date(repliedAtUtc).toLocaleString('ar-EG')}
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-bg-card text-sm text-text-main border border-emerald-500/20">
                  {reply}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReply} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-text-main">
                  {t('interventions.modal.replyLabel')}
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('interventions.modal.replyPlaceholder')}
                  className="w-full p-3.5 rounded-2xl bg-bg-card border border-border-main text-text-main text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyText.trim()}
                  className="w-full py-3 px-6 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} className={isReplying ? 'animate-spin' : ''} />
                  <span>{isReplying ? t('interventions.modal.sendingReply') : t('interventions.modal.submitReply')}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
