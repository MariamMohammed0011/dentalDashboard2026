import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Building2, Star, CheckCircle2,
  XCircle, Award, Sparkles, Shield, Calendar, Clock
} from 'lucide-react';
import { useLabAvailability } from '../hooks/useLabAvailability';
import StarRating from '../../../components/shared/StarRating';

const LabProfileDetailsModal = ({ lab, isOpen, onClose }) => {
  const { t } = useTranslation();
  const getAvailabilityInfo = useLabAvailability();

  if (typeof document === 'undefined') return null;

  const availability = lab ? getAvailabilityInfo(lab.availability) : null;

  // استخراج الاسم المباشر
  const labName = lab?.labNamePlace || lab?.name || '—';

  // تركيب العنوان والمنطقة من نفس الكائن
  const addressParts = lab ? [lab.addressPlace, lab.cityPlace, lab.countryPlace].filter(Boolean) : [];
  const fullAddress = addressParts.length > 0 ? addressParts.join('، ') : 'غير متوفر';

  return createPortal(
    <AnimatePresence>
      {isOpen && lab && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" dir="rtl">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden z-10 border border-slate-100 dark:border-slate-800"
          >
            {/* Header Banner */}
            <div className="relative h-32 sm:h-44 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-4 sm:p-8 lg:p-10 flex items-end justify-between overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-black/15 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-xl rounded-lg sm:rounded-[2rem] flex items-center justify-center text-white border border-white/30 shadow-2xl shrink-0 overflow-hidden"
                >
                  {lab.profilePictureUrl ? (
                    <img src={lab.profilePictureUrl} alt={labName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={28} className="sm:w-10 sm:h-10" />
                  )}
                </motion.div>
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-white min-w-0 flex-1"
                >
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full tracking-widest leading-none inline-block">
                      {t('labs.detailsModal.headerNumber', { id: lab.id })}
                    </span>
                  </div>

                  {/* اسم المكان */}
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight truncate">
                    {labName}
                  </h2>
                </motion.div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-3 sm:top-8 left-3 sm:left-8 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-2xl text-white transition-all hover:rotate-90 backdrop-blur-xl border border-white/10 cursor-pointer shrink-0"
              >
                <X size={18} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-8 lg:p-10 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                
                {/* الجانب الأيمن: الجاهزية والخبرة */}
                <motion.section 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-6"
                >
                  <h3 className="text-[9px] sm:text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <span className="w-6 sm:w-8 h-[1px] bg-gray-200 dark:bg-slate-800" />
                    {t('labs.detailsModal.professionalProfile')}
                  </h3>
                  
                  {/* حالة التوفر */}
                  {availability && (
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl sm:rounded-2xl text-emerald-500 shrink-0">
                        <Shield size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-black mb-1 uppercase tracking-wider">{t('labs.detailsModal.availabilityStatus')}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full border ${availability.color}`}>
                          <span className={`w-2 h-2 rounded-full ${availability.dot}`} />
                          {availability.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* متوسط التقييم */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl sm:rounded-2xl text-amber-500 shrink-0">
                      <Star size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-black mb-1 uppercase tracking-wider">{t('labs.averageRating')}</span>
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={lab.averageRating} size={16} className="sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-bold text-text-main dark:text-gray-300">
                          ({Number(lab.averageRating || 0).toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* سنوات الخبرة */}
                  {lab.yearsOfExperience !== undefined && lab.yearsOfExperience !== null && (
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-xl sm:rounded-2xl text-violet-500 shrink-0">
                        <Award size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-black mb-0.5 uppercase tracking-wider">{t('labs.detailsModal.yearsOfExperience')}</span>
                        <span className="text-sm sm:text-base text-text-main dark:text-gray-200 font-bold">
                          {lab.yearsOfExperience} {t('labs.detailsModal.yearsExperienceSuffix')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* خدمة المسح الضوئي */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl sm:rounded-2xl text-cyan-500 shrink-0">
                      <Sparkles size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-black mb-0.5 uppercase tracking-wider">{t('labs.detailsModal.scanVisitService')}</span>
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-text-main dark:text-gray-200">
                        {lab.hasScanVisitService ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            {t('labs.detailsModal.supportsScanVisit')}
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-gray-400" />
                            {t('labs.detailsModal.doesNotSupportScanVisit')}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </motion.section>

                {/* الجانب الأيسر: اسم المكان والعنوان فقط */}
                <motion.section 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-6"
                >
                  <h3 className="text-[9px] sm:text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <span className="w-6 sm:w-8 h-[1px] bg-gray-200 dark:bg-slate-800" />
                    {t('labs.detailsModal.addressAndRegion')}
                  </h3>

                  {/* اسم المكان */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl sm:rounded-2xl text-blue-500 shrink-0">
                      <Building2 size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-black mb-0.5 uppercase tracking-wider">{t('labs.detailsModal.placeName')}</span>
                      <span className="text-sm sm:text-base text-text-main dark:text-gray-200 font-bold truncate">
                        {labName}
                      </span>
                    </div>
                  </div>

                  {/* العنوان الكامل */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl sm:rounded-2xl text-rose-500 shrink-0 mt-0.5">
                      <MapPin size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-black mb-0.5 uppercase tracking-wider">{t('labs.detailsModal.fullAddressAndRegion')}</span>
                      <span className="text-sm sm:text-base text-text-main dark:text-gray-200 font-bold line-clamp-2">
                        {fullAddress}
                      </span>
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* التخصصات والمواد */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 border-t border-slate-100 dark:border-slate-800 pt-6 sm:pt-8"
              >
                {/* التخصصات */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <h4 className="text-xs sm:text-sm font-black text-text-main dark:text-gray-300">{t('labs.detailsModal.specialtiesAndServicesTitle')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {lab.specialties && lab.specialties.length > 0 ? (
                      lab.specialties.map((spec, index) => (
                        <span 
                          key={index} 
                          className="px-3.5 py-1.5 text-xs font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">{t('labs.detailsModal.undefined')}</span>
                    )}
                  </div>
                </div>

                {/* المواد */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <h4 className="text-xs sm:text-sm font-black text-text-main dark:text-gray-300">{t('labs.detailsModal.materialsAndDevicesTitle')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {lab.materials && lab.materials.length > 0 ? (
                      lab.materials.map((mat, index) => (
                        <span 
                          key={index} 
                          className="px-3.5 py-1.5 text-xs font-black bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-xl"
                        >
                          {mat}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">{t('labs.detailsModal.undefined')}</span>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* معلومات الاشتراك */}
              {(lab.subscriptionStartUtc || lab.subscriptionEndUtc) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800/50"
                >
                  <h4 className="text-[9px] sm:text-xs font-black text-blue-600 dark:text-blue-400 uppercase mb-3 sm:mb-4 tracking-wider flex items-center gap-2">
                    <Calendar size={14} />
                    {t('labs.detailsModal.subscriptionInfo') || 'معلومات الاشتراك'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {lab.subscriptionStartUtc && (
                      <div className="flex flex-col">
                        <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">بداية الاشتراك</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200">
                          {new Date(lab.subscriptionStartUtc).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {lab.subscriptionEndUtc && (
                      <div className="flex flex-col">
                        <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">نهاية الاشتراك</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1">
                          {new Date(lab.subscriptionEndUtc).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                          {new Date(lab.subscriptionEndUtc) > new Date() ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : (
                            <XCircle size={14} className="text-rose-500" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  {lab.subscriptionEndUtc && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/50">
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{
                        color: new Date(lab.subscriptionEndUtc) > new Date() ? '#059669' : '#dc2626'
                      }}>
                        <Clock size={13} />
                        {new Date(lab.subscriptionEndUtc) > new Date()
                          ? `نشط حتى ${new Date(lab.subscriptionEndUtc).toLocaleDateString('ar-SA')}`
                          : `انتهى في ${new Date(lab.subscriptionEndUtc).toLocaleDateString('ar-SA')}`
                        }
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* الوصف */}
              {lab.description && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <h4 className="text-[9px] sm:text-xs font-black text-gray-400 dark:text-slate-500 uppercase mb-2 sm:mb-3 tracking-wider">{t('labs.detailsModal.descriptionTitle')}</h4>
                  <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {lab.description}
                  </p>
                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LabProfileDetailsModal;