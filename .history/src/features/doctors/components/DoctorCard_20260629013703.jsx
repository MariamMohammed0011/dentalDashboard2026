import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Building2, Calendar } from 'lucide-react';
import framerImg from '../../../assets/framer.png';

const DoctorCard = ({ name, email, phone, clinicName, clinicAddress, city, country, status, createdAt }) => {
  const isStatusActive = status?.toLowerCase() === 'active';
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-bg-card rounded-[2.5rem] p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden min-h-[290px] w-full border border-slate-100 dark:border-slate-800" 
      dir="rtl"
    >
      {/* 1. Background Overlay */}#
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <img 
          src={framerImg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full flex-grow gap-4">
        {/* Header: Avatar, Name & Status */}
        <div className="flex items-start gap-4">
          {/* Doctor Avatar */}
          <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-sky-50 dark:bg-sky-950 flex-shrink-0 flex items-center justify-center">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'طبيب')}&background=e0f2fe&color=367AFF&bold=true&size=128`} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Name & Status */}
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-black text-text-main dark:text-gray-100 text-[16px] tracking-tight truncate leading-tight">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`flex h-2 w-2 rounded-full ${isStatusActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className={`text-[12px] font-bold ${isStatusActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                {isStatusActive ? 'حساب نشط' : 'معلق / غير نشط'}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-800/80" />

        {/* Content: Clinic & Location details */}
        <div className="flex flex-col gap-2.5 text-[13px] text-gray-600 dark:text-slate-400 font-bold">
          {clinicName && (
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-primary/70 dark:text-primary/50 flex-shrink-0" />
              <span className="truncate text-text-main dark:text-gray-200">{clinicName}</span>
            </div>
          )}
          
          {(city || country || clinicAddress) && (
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-primary/70 dark:text-primary/50 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 leading-relaxed">
                {[clinicAddress, city, country].filter(Boolean).join('، ')}
              </span>
            </div>
          )}
        </div>

        {/* Contacts details */}
        <div className="flex flex-col gap-2 mt-auto">
          {phone && (
            <a 
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-[13px] text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
            >
              <Phone size={14} className="flex-shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="font-medium tracking-wide font-sans">{phone}</span>
            </a>
          )}
          {email && (
            <a 
              href={`mailto:${email}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-[13px] text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary truncate"
            >
              <Mail size={14} className="flex-shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="font-medium truncate font-sans">{email}</span>
            </a>
          )}
        </div>

        {/* Footer: Date of register */}
        {formattedDate && (
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-50 dark:border-slate-800/40 text-[11px] text-gray-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              انضم في: {formattedDate}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorCard;
