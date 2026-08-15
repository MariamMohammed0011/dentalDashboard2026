import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Building2, Calendar } from 'lucide-react';
import framerImg from '../../../assets/framer.png';

const DoctorCard = ({ id, name, email, phone, clinicName, clinicAddress, city, country, status, createdAt, statusBadge }) => {
  const { t } = useTranslation();
  const isStatusActive = status?.toLowerCase() === 'active';
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-slate-800/60 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 shadow-sm hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 group relative overflow-hidden min-h-[300px] sm:min-h-[320px] w-full border border-slate-100/60 dark:border-slate-700/40"
      dir="rtl"
    >
      
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <img 
          src={framerImg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full flex-grow gap-4">
        {(id || statusBadge) && (
          <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-slate-100/60 dark:border-slate-700/40 gap-2">
            {id ? (
              <span className="text-[10px] sm:text-xs font-bold text-text-muted dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl whitespace-nowrap">ID: #{id}</span>
            ) : <div />}
            {statusBadge}
          </div>
        )}
        
        <div className="flex items-start gap-2.5 sm:gap-4">

          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-[1.25rem] overflow-hidden border-2 border-white/80 dark:border-slate-600 shadow-md bg-sky-50 dark:bg-slate-900/50 flex-shrink-0 flex items-center justify-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || t('doctors.doctor'))}&background=e0f2fe&color=367AFF&bold=true&size=128`}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <h3 className="font-black text-text-main dark:text-gray-100 text-[14px] sm:text-[16px] tracking-tight truncate leading-tight">
              {name}
            </h3>
            {!statusBadge && (
              <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                <span className={`flex h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full ${isStatusActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`text-[10px] sm:text-[12px] font-bold truncate ${isStatusActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {isStatusActive ? t('doctors.activeAccount') : t('doctors.inactiveAccount')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-slate-100/60 dark:bg-slate-700/40" />

        <div className="flex flex-col gap-1.5 sm:gap-2.5 text-[12px] sm:text-[13px] text-gray-600 dark:text-slate-400 font-bold">
          {clinicName && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Building2 size={14} className="text-primary/60 dark:text-primary/50 flex-shrink-0 sm:w-4 sm:h-4" />
              <span className="truncate text-text-main dark:text-gray-200">{clinicName}</span>
            </div>
          )}

          {(city || country || clinicAddress) && (
            <div className="flex items-start gap-1.5 sm:gap-2">
              <MapPin size={14} className="text-primary/60 dark:text-primary/50 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
              <span className="line-clamp-2 leading-relaxed text-text-muted dark:text-slate-400">
                {[clinicAddress, city, country].filter(Boolean).join('، ')}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-[11px] sm:text-[13px] text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
            >
              <Phone size={12} className="flex-shrink-0 text-slate-400 dark:text-slate-500 sm:w-3.5 sm:h-3.5" />
              <span className="font-medium tracking-wide font-sans truncate">{phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-[11px] sm:text-[13px] text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary truncate"
            >
              <Mail size={12} className="flex-shrink-0 text-slate-400 dark:text-slate-500 sm:w-3.5 sm:h-3.5" />
              <span className="font-medium truncate font-sans">{email}</span>
            </a>
          )}
        </div>

        {formattedDate && (
          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-slate-100/60 dark:border-slate-700/40 text-[9px] sm:text-[10px] text-gray-400 dark:text-slate-500">
            <span className="flex items-center gap-1 truncate">
              <Calendar size={11} className="flex-shrink-0 sm:w-3 sm:h-3" />
              <span className="truncate">{t('doctors.joinedAt')}: {formattedDate}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorCard;
