import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Building2, Star, CheckCircle2, 
  XCircle, Award, Sparkles, Shield 
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
            <div className="relative h-44 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-8 sm:p-10 flex items-end justify-between overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-black/15 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex items-center gap-6">
                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white border border-white/30 shadow-2xl shrink-0 overflow-hidden"
                >
                  {lab.profilePictureUrl ? (
                    <img src={lab.profilePictureUrl} alt={labName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={40} />
                  )}
                </motion.div>
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-white min-w-0"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold py-1.5 px-3.5 rounded-full tracking-widest leading-none inline-block">
                      {t('labs.detailsModal.headerNumber', { id: lab.id })}
                    </span>
                  </div>
                  
                  {/* اسم المكان */}
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none truncate mb-1">
                    {labName}
                  </h2>
                </motion.div>
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all hover:rotate-90 backdrop-blur-xl border border-white/10 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 sm:p-10 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                
                {/* الجانب الأيمن: الجاهزية والخبرة */}
                <motion.section 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-6"
                >
                  <h3 className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                    <span className="w-8 h-[1px] bg-gray-200 dark:bg-slate-800" />
                    {t('labs.detailsModal.professionalProfile')}
                  </h3>
                  
                  {/* حالة التوفر */}
                  {availability && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                        <Shield size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black mb-1">{t('labs.detailsModal.availabilityStatus')}</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${availability.color}`}>
                          <span className={`w-2 h-2 rounded-full ${availability.dot}`} />
                          {availability.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* متوسط التقييم */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                      <Star size={20} className="text-amber-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-black mb-1">{t('labs.averageRating')}</span>
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={lab.averageRating} size={18} />
                        <span className="text-sm font-bold text-text-main dark:text-gray-300">
                          ({Number(lab.averageRating || 0).toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* سنوات الخبرة */}
                  {lab.yearsOfExperience !== undefined && lab.yearsOfExperience !== null && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                        <Award size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black mb-0.5">{t('labs.detailsModal.yearsOfExperience')}</span>
                        <span className="text-[15px] text-text-main dark:text-gray-200 font-bold">
                          {lab.yearsOfExperience} {t('labs.detailsModal.yearsExperienceSuffix')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* خدمة المسح الضوئي */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-black mb-0.5">{t('labs.detailsModal.scanVisitService')}</span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-text-main dark:text-gray-200">
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
                  <h3 className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                    <span className="w-8 h-[1px] bg-gray-200 dark:bg-slate-800" />
                    {t('labs.detailsModal.addressAndRegion')}
                  </h3>

                  {/* اسم المكان */}
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-black mb-0.5">{t('labs.detailsModal.placeName')}</span>
                      <span className="text-[15px] text-text-main dark:text-gray-200 font-bold">
                        {labName}
                      </span>
                    </div>
                  </div>

                  {/* العنوان الكامل */}
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-black mb-0.5">{t('labs.detailsModal.fullAddressAndRegion')}</span>
                      <span className="text-[14px] text-text-main dark:text-gray-200 font-bold">
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
                className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8"
              >
                {/* التخصصات */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[13px] font-black text-text-main dark:text-gray-300">{t('labs.detailsModal.specialtiesAndServicesTitle')}</h4>
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
                <div className="flex flex-col gap-3">
                  <h4 className="text-[13px] font-black text-text-main dark:text-gray-300">{t('labs.detailsModal.materialsAndDevicesTitle')}</h4>
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
              
              {/* الوصف */}
              {lab.description && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase mb-2">{t('labs.detailsModal.descriptionTitle')}</h4>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">
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