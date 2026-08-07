import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Clock, ShieldCheck, Building2, FlaskConical, ArrowLeft } from 'lucide-react';

const InterventionCard = ({ complaint, onViewDetails }) => {
  const { t } = useTranslation();
  const {
    id,
    destination,
    title,
    text,
    user,
    createdAtUtc,
    reply,
    repliedAtUtc,
  } = complaint || {};

  const isReplied = Boolean(reply || repliedAtUtc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-bg-card border border-border-main/70 hover:border-primary/50 rounded-[1.8rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
      dir="rtl"
    >
      {/* Dynamic Side Accent Pill */}
      <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${isReplied ? 'bg-emerald-500' : 'bg-amber-500'} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top z-20 rounded-l-full`} />

      <div className="space-y-3">
        {/* Top Header: ID & Status Badges */}
        <div className="flex items-center justify-between gap-2 border-b border-border-main/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-text-main bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
              #{id}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              destination === 'Lab' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}>
              {destination === 'Lab' ? <FlaskConical size={12} /> : <MessageSquare size={12} />}
              {destination === 'Lab' ? t('interventions.modal.targetLabBadge') : t('interventions.modal.targetAdmin')}
            </span>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            isReplied
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
          }`}>
            {isReplied ? <ShieldCheck size={13} /> : <Clock size={13} />}
            {isReplied ? t('interventions.statusFilter.replied') : t('interventions.statusFilter.pending')}
          </span>
        </div>

        {/* Doctor Details Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
            {user?.name ? user.name.charAt(0) : 'ط'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-text-main truncate" title={user?.name}>
              {user?.name || t('doctors.doctor')}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Building2 size={12} className="shrink-0" />
              <span className="truncate">{user?.namePlace || t('doctors.clinicName')}</span>
            </div>
          </div>
        </div>

        {/* Title & Description Snippet */}
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-primary line-clamp-1">
            {title || t('interventions.modal.noSubject')}
          </h5>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {text || t('interventions.modal.noDetails')}
          </p>
        </div>
      </div>

      {/* Footer: Date & Details Button */}
      <div className="pt-3 mt-4 border-t border-border-main/50 flex justify-between items-center text-xs">
        <span className="text-[11px] text-text-muted flex items-center gap-1">
          <Clock size={12} />
          {createdAtUtc ? new Date(createdAtUtc).toLocaleDateString('ar-EG') : ''}
        </span>

        <button
          onClick={() => onViewDetails(complaint)}
          className="flex items-center gap-1 font-bold text-primary hover:text-primary-hover group-hover:translate-x-[-2px] transition-transform"
        >
          <span>{t('interventions.viewDetails')}</span>
          <ArrowLeft size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default InterventionCard;
