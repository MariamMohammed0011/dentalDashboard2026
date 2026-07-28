import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FlaskConical, ChevronLeft, Star, ChevronDown, Loader2 } from 'lucide-react';
import { useLabDetails } from '../hooks/useLabDetails';
import { useLabStatusConfig } from '../hooks/useLabStatusConfig';
import StarRating from '../../../components/shared/StarRating';
import framerImg from '../../../assets/framer.png';

const LabCard = ({ id, name, onShowDetails, onEditStatus, updatingLabId }) => {
  const { t } = useTranslation();
  const { data: details, isLoading } = useLabDetails(id);
  const getStatusConfig = useLabStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-bg-card rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden border border-slate-100 dark:border-slate-800 w-full min-h-[210px]"
      dir="rtl"
    >
      {/* خلفية الصورة */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <img
          src={framerImg}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full gap-3">
        
        {/* --- الهيدر: الأيقونة + الاسم + الحالة --- */}
        <div className="flex items-start justify-between gap-2.5 w-full">
          
          {/* الأيقونة والاسم */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200 dark:shadow-none transition-transform group-hover:scale-105 duration-300 shrink-0">
              <FlaskConical size={20} />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              {/* <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider uppercase leading-none mb-1">
                {t('labs.labType')}
              </span> */}
              <h3 
                className="font-bold text-slate-800 dark:text-gray-100 text-xs sm:text-sm leading-snug line-clamp-2 break-words"
                title={name}
              >
                {name || '—'}
              </h3>
            </div>
          </div>

          {/* زر / مؤشر الحالة */}
          {!isLoading && details?.owner?.status && (() => {
            const isCurrentlyUpdating = updatingLabId === id;
            if (isCurrentlyUpdating) {
              return (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 animate-pulse select-none shrink-0">
                  <Loader2 size={10} className="animate-spin text-emerald-600 shrink-0" />
                  <span>{t('common.processing')}</span>
                </div>
              );
            }

            const statusCfg = getStatusConfig(details.owner.status);
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditStatus) {
                    onEditStatus({
                      id,
                      name,
                      status: details.owner.status,
                      address: [details.owner.addressPlace, details.owner.cityPlace, details.owner.countryPlace].filter(Boolean).join('، ')
                    });
                  }
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${statusCfg.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                <span>{statusCfg.label}</span>
                <ChevronDown size={10} className="opacity-70 shrink-0" />
              </button>
            );
          })()}
        </div>

        {/* --- البودي: التقييم --- */}
        <div className="flex items-center gap-2.5 bg-slate-50/90 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-amber-500 shadow-2xs shrink-0">
            <Star size={15} className="fill-amber-400 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
              {t('labs.averageRating')}
            </span>
            <div className="flex items-center gap-1">
              {isLoading ? (
                <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20" />
              ) : (
                <>
                  <StarRating rating={details?.averageRating} size={12} />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-gray-200 dir-ltr leading-none">
                    ({details?.averageRating?.toFixed(1) || '0.0'})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- الفوتر: رقم المختبر وزر التفاصيل --- */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold dir-ltr">
            #{id}
          </span>

          <button
            onClick={() => onShowDetails(id)}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/50 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white rounded-lg text-[11px] font-bold transition-all active:scale-95 group/btn"
          >
            {t('common.details')}
            <ChevronLeft size={13} className="group-hover/btn:-translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default LabCard;