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
      className="group relative bg-bg-card border border-border-main/70 hover:border-primary/50 rounded-[1.8rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full overflow-hidden font-zain"
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
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${destination === 'Lab' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}>
              {destination === 'Lab' ? <FlaskConical size={13} className="text-amber-500" /> : <MessageSquare size={13} className="text-blue-500" />}
              {destination === 'Lab' ? t('interventions.modal.targetLabBadge') : t('interventions.modal.targetAdmin')}
            </span>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${isReplied
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
            }`}>
            {isReplied ? <ShieldCheck size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}
            {isReplied ? t('interventions.statusFilter.replied') : t('interventions.statusFilter.pending')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
            {user?.name ? user.name.charAt(0) : 'ط'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-text-main truncate" title={user?.name}>
              {user?.name || t('doctors.doctor')}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold">
              <Building2 size={13} className="text-sky-500 dark:text-sky-400 shrink-0" />
              <span className="truncate">{user?.namePlace || t('doctors.clinicName')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h5 className="text-xs font-black text-primary line-clamp-1">
            {title || t('interventions.modal.noSubject')}
          </h5>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2 font-medium">
            {text || t('interventions.modal.noDetails')}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border-main/50 flex justify-between items-center text-xs">
        <span className="text-[11px] text-text-muted font-bold flex items-center gap-1.5">
          <Clock size={13} className="text-indigo-500 dark:text-indigo-400" />
          {createdAtUtc ? new Date(createdAtUtc).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
        </span>

        <button
          onClick={() => onViewDetails(complaint)}
          className="flex items-center gap-1.5 font-black text-primary hover:text-primary-hover group-hover:translate-x-[-3px] transition-all cursor-pointer"
        >
          <span>{t('interventions.viewDetails')}</span>
          <ArrowLeft size={14} className="text-primary" />
        </button>
      </div>
    </motion.div>
  );
};

export default InterventionCard;
