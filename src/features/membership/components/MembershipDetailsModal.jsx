import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, User, Mail, Phone, MapPin, Building2, Globe, FileText, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../../api/axios';

const MembershipDetailsModal = ({ request, isOpen, onClose, isLoading }) => {
  const { t } = useTranslation();
  if (typeof document === 'undefined') return null;

  const isDoctor = request ? (request.role?.toLowerCase() === 'dentist' || request.type === 'doctor') : true;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" dir="rtl">
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
            className="relative bg-white w-full max-w-sm sm:max-w-lg md:max-w-2xl rounded-3xl sm:rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden z-10 mx-4"
          >

            {isLoading ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6 bg-white">
                <div className="relative">
                  <Loader2 size={60} className="text-primary animate-spin" />
                  <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse rounded-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-text-main mb-1">{t('membership.detailsModal.loadingData')}</h3>
                  <p className="text-gray-400 text-sm font-bold">{t('membership.detailsModal.pleaseWait')}</p>
                </div>
              </div>
            ) : request ? (
              <>
                {/* Header */}
                <div className={`relative h-32 sm:h-40 bg-gradient-to-br ${isDoctor
                    ? 'from-[#367AFF] via-[#367AFF] to-[#0051FF]'
                    : 'from-[#10B981] via-[#059669] to-[#047857]'
                  } p-6 sm:p-10 flex items-end justify-between overflow-hidden`}>
                  <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-black/20 rounded-full blur-2xl" />

                  <div className="relative z-10 flex items-center gap-4 sm:gap-6 pl-14 sm:pl-0">
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white border border-white/30 shadow-2xl shrink-0"
                    >
                      <User size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </motion.div>
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-white min-w-0"
                    >
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-tight mb-1.5 truncate">
                        {request.fullName || request.name || t('membership.detailsModal.unknownName')}
                      </h2>
                      <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                          {request.role?.toLowerCase() === 'dentist' || request.type === 'doctor'
                            ? t('membership.detailsModal.dentist')
                            : t('membership.detailsModal.lab')}  </p>
                      </div>
                    </motion.div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 left-4 sm:top-6 md:top-8 sm:left-6 md:left-8 p-2 sm:p-2.5 md:p-3 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-2xl text-white transition-all hover:rotate-90 backdrop-blur-xl border border-white/10 z-[60] cursor-pointer"
                  >
                    <X size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                </div>


                <div className="p-5 sm:p-8 md:p-10 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">


                    <motion.section
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="w-6 sm:w-8 h-[1px] bg-gray-200" />
                        {t('membership.detailsModal.contactInfo')}
                      </h3>

                      <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                        <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110 ${isDoctor
                            ? 'bg-primary/10 text-primary'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                          <Mail size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">{t('membership.detailsModal.email')}</span>
                          <span className="text-[13px] sm:text-[15px] text-text-main font-bold truncate">{request.email || t('membership.detailsModal.notAvailable')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                        <div className="p-2.5 sm:p-3.5 bg-green-50 dark:bg-emerald-950/30 rounded-xl sm:rounded-2xl text-green-600 dark:text-emerald-400 transition-all duration-300 group-hover:scale-110">
                          <Phone size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">{t('membership.detailsModal.phone')}</span>
                          <span className="text-[13px] sm:text-[15px] text-text-main font-bold truncate">{request.phoneNumber || request.phone || t('membership.detailsModal.notAvailable')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                        <div className="p-2.5 sm:p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl sm:rounded-2xl text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110">
                          <Calendar size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">{t('membership.detailsModal.joinDate')}</span>
                          <span className="text-[15px] text-text-main font-bold">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : t('membership.detailsModal.notAvailable')}
                          </span>
                        </div>
                      </div>
                    </motion.section>


                    <motion.section
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="w-6 sm:w-8 h-[1px] bg-gray-200" />
                        {t('membership.detailsModal.locationDetails')}
                      </h3>

                      <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                        <div className="p-2.5 sm:p-3.5 bg-purple-50 dark:bg-purple-950/30 rounded-xl sm:rounded-2xl text-purple-600 dark:text-purple-400 transition-all duration-300 group-hover:scale-110">
                          <Building2 size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">{t('membership.detailsModal.facilityName')}</span>
                          <span className="text-[13px] sm:text-[15px] text-text-main font-bold truncate">{request.workplaceName || request.namePlace || t('membership.detailsModal.notAvailable')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                        <div className="p-2.5 sm:p-3.5 bg-orange-50 dark:bg-orange-950/30 rounded-xl sm:rounded-2xl text-orange-600 dark:text-orange-400 transition-all duration-300 group-hover:scale-110">
                          <MapPin size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">{t('membership.detailsModal.address')}</span>
                          <span className="text-[13px] sm:text-[15px] text-text-main font-bold truncate">{request.address || request.addressPlace || t('membership.detailsModal.notAvailable')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                        <div className="p-2.5 sm:p-3.5 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl sm:rounded-2xl text-cyan-600 dark:text-cyan-400 transition-all duration-300 group-hover:scale-110">
                          <Globe size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">{t('membership.detailsModal.region')}</span>
                          <span className="text-[15px] text-text-main font-bold">
                            {request.city || request.cityPlace} {request.country || request.countryPlace ? `/ ${request.country || request.countryPlace}` : ''}
                          </span>
                        </div>
                      </div>
                    </motion.section>
                  </div>

                  {(() => {
                    const docPath = request.documentUrl || request.verificationDocumentPath || request.verification_doc;
                    if (!docPath) return null;

                    const baseUrl = axiosInstance.defaults.baseURL.replace('/api', '');
                    const fullImageUrl = docPath.startsWith('http') ? docPath : `${baseUrl}/${docPath.startsWith('/') ? docPath.slice(1) : docPath}`;

                    return (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="mt-6 sm:mt-8 md:mt-12 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-[2.5rem] border border-gray-200/50 flex flex-col gap-4 sm:gap-6 group/doc hover:border-primary/30 transition-all duration-500 shadow-inner"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                            <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-white rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-primary shadow-xl group-hover/doc:rotate-6 transition-transform shrink-0">
                              <FileText size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
                            </div>
                            <div>
                              <h4 className="text-base sm:text-lg font-black text-text-main mb-1 tracking-tight">{t('membership.detailsModal.verificationDoc')}</h4>
                              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('membership.detailsModal.verifyDocDesc')}</p>
                            </div>
                          </div>

                          <a
                            href={fullImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-white text-[11px] sm:text-[12px] md:text-[13px] font-black rounded-lg sm:rounded-2xl transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap ${isDoctor
                                ? 'bg-[#367AFF] shadow-[0_10px_30px_rgba(54,122,255,0.3)] hover:bg-[#0051FF]'
                                : 'bg-[#10B981] shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:bg-[#047857]'
                              }`}
                          >
                            {t('membership.detailsModal.previewDoc')}
                          </a>
                        </div>

                        <div className="mt-2 w-full overflow-hidden rounded-lg sm:rounded-2xl border border-gray-200 bg-white p-1 sm:p-2 shadow-sm">
                          <img
                            src={fullImageUrl}
                            alt="Verification Document"
                            className="w-full h-auto max-h-40 sm:max-h-60 object-contain rounded-md sm:rounded-xl"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(t('membership.detailsModal.imageLoadError'))}`;
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MembershipDetailsModal;