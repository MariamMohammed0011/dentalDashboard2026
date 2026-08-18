import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Clock,
  ShieldCheck,
  Building2,
  FlaskConical,
  Eye,
  ShieldAlert,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const InterventionTable = ({ complaints = [], isLoading, onViewDetails }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="animate-pulse space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs font-zain">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center mb-3 shadow-xs">
          <Inbox size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{t('interventions.emptyState.title') || 'لا يوجد شكاوى أو بلاغات'}</h3>
        <p className="text-xs text-slate-400 max-w-md mt-1 font-medium">
          {t('interventions.emptyState.desc') || 'لا توجد شكاوى مسجلة تطابق التصفية المحددة حالياً.'}
        </p>
      </div>
    );
  }

  return (
    <div className="font-zain" dir="rtl">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-center border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-300">
              <th className="py-4 px-4 text-center w-[6%]">
                <span>#ID</span>
              </th>
              <th className="py-4 px-4 text-center w-[20%] ">
                <div className="flex items-center text-center justify-center   gap-1.5 text-slate-500 dark:text-slate-400">
                  <Building2 size={15} className="text-sky-500 shrink-0" />
                  <span>  العيادة</span>
                </div>
              </th>
              <th className="py-4 px-4 text-center w-[24%]">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <ShieldAlert size={15} className="text-amber-500 shrink-0" />
                  <span>الجهة الموجه إليها</span>
                </div>
              </th>
              <th className="py-4 px-4 text-center w-[28%]">
                <div className="flex items-center text-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MessageSquare size={15} className="text-indigo-500 shrink-0" />
                  <span>مضمون الشكوى</span>
                </div>
              </th>
              <th className="py-4 px-4 text-center w-[15%]">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Clock size={15} className="text-purple-500 shrink-0" />
                  <span>الحالة</span>
                </div>
              </th>
              <th className="py-4 px-4 text-center w-[7%]">
                <span>عرض</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200">
            {complaints.map((item) => {
              const {
                id,
                destination,
                title,
                text,
                user,
                createdAtUtc,
                reply,
                repliedAtUtc,
              } = item || {};

              const isReplied = Boolean(reply || repliedAtUtc);
              const isLabTarget = destination === 'Lab';

              return (
                <tr key={id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-150 group">
                  {/* Complaint ID */}
                  <td className="py-4 px-4 text-center">
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-1 rounded-xl">
                      #{id}
                    </span>
                  </td>

                  {/* Doctor & Clinic */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xs border border-sky-500/20 shrink-0">
                        {user?.name ? user.name.charAt(0) : 'ط'}
                      </div> */}
                      <div className="text-center min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate" title={user?.name}>
                          {user?.name || t('doctors.doctor') || 'طبيب'}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <Building2 size={12} className="shrink-0 text-sky-500" />
                          <span>{user?.namePlace || t('doctors.clinicName') || 'العيادة'}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Target Destination */}
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${
                      isLabTarget
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                    }`}>
                      {isLabTarget ? (
                        <FlaskConical size={13} className="text-amber-500 shrink-0" />
                      ) : (
                        <ShieldAlert size={13} className="text-indigo-500 shrink-0" />
                      )}
                      <span>{isLabTarget ? t('interventions.modal.targetLabBadge') || 'موجهة إلى المخبر' : t('interventions.modal.targetAdmin') || 'موجهة إلى الإدارة'}</span>
                    </span>
                  </td>

                  {/* Title & Text Snippet */}
                  <td className="py-4 px-4 text-center">
                    <div className="min-w-0 pr-1">
                      <p className="font-black text-slate-900 dark:text-slate-100 text-xs truncate" title={title}>
                        {title || t('interventions.modal.noSubject') || 'بدون عنوان'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5" title={text}>
                        {text || t('interventions.modal.noDetails') || 'لا يوجد تفاصيل إضافية'}
                      </p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${
                      isReplied
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isReplied ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      {isReplied ? (
                        <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Clock size={13} className="text-amber-500 shrink-0" />
                      )}
                      <span>{isReplied ? t('interventions.statusFilter.replied') || 'تم الرد عليها' : t('interventions.statusFilter.pending') || 'بانتظار الرد'}</span>
                    </span>
                  </td>

                  {/* Actions & Eye Button */}
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      title="معاينة التفاصيل والرد"
                      className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/60 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center mx-auto"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {complaints.map((item) => {
          const {
            id,
            destination,
            title,
            text,
            user,
            createdAtUtc,
            reply,
            repliedAtUtc,
          } = item || {};

          const isReplied = Boolean(reply || repliedAtUtc);
          const isLabTarget = destination === 'Lab';

          return (
            <div key={id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-0.5 rounded-lg">
                    #{id}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isLabTarget
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                  }`}>
                    {isLabTarget ? <FlaskConical size={12} /> : <ShieldAlert size={12} />}
                    <span>{isLabTarget ? 'موجهة للمخبر' : 'موجهة للإدارة'}</span>
                  </span>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isReplied
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  {isReplied ? <ShieldCheck size={12} /> : <Clock size={12} />}
                  <span>{isReplied ? 'تم الرد' : 'بانتظار الرد'}</span>
                </span>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xs border border-sky-500/20 shrink-0">
                  {user?.name ? user.name.charAt(0) : 'ط'}
                </div>
                <div className="text-right min-w-0">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{user?.name || 'طبيب'}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">{user?.namePlace || 'العيادة'}</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1 bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                <p className="font-black text-slate-900 dark:text-slate-100 text-xs">{title || 'بدون عنوان'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{text || 'لا يوجد تفاصيل'}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatDate(createdAtUtc)}</span>
                </span>

                <button
                  type="button"
                  onClick={() => onViewDetails(item)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Eye size={13} />
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterventionTable;
