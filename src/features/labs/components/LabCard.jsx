import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FlaskConical, ChevronLeft, Star, CheckCircle2, Clock } from 'lucide-react';
import StarRating from '../../../components/shared/StarRating';

const LabCard = ({ id, name, averageRating, availability, subscriptionEndUtc, onShowDetails }) => {
  const { t } = useTranslation();

  const isAvailable = availability?.toLowerCase() === 'available';
  const subscriptionEndDate = subscriptionEndUtc ? new Date(subscriptionEndUtc).toLocaleDateString('ar-SA') : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      /* 💡 التعديل هنا: إضافة إطار زمردي/أخضر ناعم للكارد مع إطار أغمق وأوضح عند الـ Hover */
      className="bg-white/80 dark:bg-bg-card rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden border  dark:border-emerald-800/50 border-emerald-500 dark:hover:border-emerald-400 w-full min-h-[170px]"
      dir="rtl"
    >
      <div className="relative z-10 flex flex-col justify-between h-full gap-3">
        
        {/* الهيدر: أيقونة المخبر + اسم المكان + حالة التوفر */}
        <div className="flex items-start justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <FlaskConical size={20} />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="font-bold text-slate-800 dark:text-gray-100 text-xs sm:text-sm leading-snug line-clamp-1 break-words"
                title={name}
              >
                {name || '—'}
              </h3>
              {/* حالة التوفر */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isAvailable
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-400'
                }`}>
                  <CheckCircle2 size={12} className={isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'} />
                  <span>{isAvailable ? t('labs.available') || 'متاح' : t('labs.unavailable') || 'غير متاح'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* عرض متوسط التقييم */}
        <div className="flex items-center gap-2.5  dark:bg-slate-800/60 p-2 rounded-xl  dark:border-slate-700/60">
          <div className="p-1.5  dark:bg-slate-800 rounded-lg text-amber-500 shadow-2xs shrink-0">
            <Star size={18} className="fill-amber-400 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg text-gray-700 dark:text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
              {t('labs.averageRating')}
            </span>
            <div className="flex items-center gap-1">
              <StarRating rating={averageRating || 0} size={16} />
              <span className="text-[11px] font-bold text-slate-700 dark:text-gray-200 dir-ltr leading-none">
                ({Number(averageRating || 0).toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        {/* الفوتر: الرقم التعريفي + زر التفاصيل */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold dir-ltr">
            #{id}
          </span>

          <button
            onClick={() => onShowDetails(id)}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/50 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white rounded-lg text-[11px] font-bold transition-all active:scale-95 group/btn cursor-pointer"
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