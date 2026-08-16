import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, User, Mail, Phone, MapPin, Building2,
  Calendar, FileText
} from 'lucide-react';

const LabTechnicianDetailsModal = ({ tech, isOpen, onClose }) => {
  const { t } = useTranslation();
  if (typeof document === 'undefined') return null;

  // تنسيق تاريخ الإنشاء
  const formattedDate = tech?.createdAt
    ? new Date(tech.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    : (t('technicians.unspecified') || 'غير محدد');

  const addressParts = tech ? [tech.addressPlace, tech.cityPlace, tech.countryPlace].filter(Boolean) : [];
  const fullAddress = addressParts.length > 0 ? addressParts.join('، ') : (t('common.unknown') || 'غير متوفر');

  return createPortal(
    <AnimatePresence>
      {isOpen && tech && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden font-zain" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 dark:border-slate-800"
          >
            <div className="relative h-36 sm:h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-5 sm:p-8 flex items-end justify-between overflow-hidden">
              <div className="relative z-10 flex items-center gap-3 sm:gap-5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shrink-0 overflow-hidden">
                  {tech.profilePictureUrl ? (
                    <img src={tech.profilePictureUrl} alt={tech.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="sm:w-9 sm:h-9" />
                  )}
                </div>
                <div className="text-white min-w-0">
                  <span className="text-[11px] sm:text-xs bg-white/20 text-white font-bold px-3 py-0.5 rounded-full inline-block mb-1">
                    فني مخبري #{tech.id}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black truncate">{tech.name || t('technicians.noName') || 'بدون اسم'}</h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-4 sm:space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">

                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                    <User size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">اسم المخبري</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate block">{tech.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                    <Mail size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">البريد الإلكتروني</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate block">{tech.email || 'غير متوفر'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                    <Phone size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">رقم الهاتف</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate block" dir="ltr">{tech.phone || 'غير متوفر'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                    <Building2 size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">اسم المخبر / مكان العمل</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate block">{tech.namePlace || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                    <MapPin size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">العنوان والمدينة</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate block">{fullAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-2.5 sm:p-3 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl shrink-0">
                    <Calendar size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">تاريخ انضمام الحساب</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate block">{formattedDate}</span>
                  </div>
                </div>

              </div>

              <div className="p-4 sm:p-5 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-400">حالة الحساب الحالية:</span>
                  <span className="px-3 py-1 text-xs font-black rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                    {tech.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <span className="text-xs font-bold text-gray-400">ملف توثيق المهنة:</span>
                  {tech.verificationDocumentPath ? (
                    <a
                      href={`https://localhost:44334/${tech.verificationDocumentPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      <FileText size={16} />
                      عرض المستند المرفق
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 font-bold">لا يوجد مستند مرفق</span>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LabTechnicianDetailsModal;