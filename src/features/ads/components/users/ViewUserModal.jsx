import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Users, Phone, Building2, MapPin, Shield, Calendar, Megaphone, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../../services/adsApi';

const ViewUserModal = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation();

  if (typeof document === 'undefined') return null;

  const { data: adsData, isLoading: isLoadingAds } = useQuery({
    queryKey: ['user-valid-ads', user?.id],
    queryFn: () => adsApi.getUserValidAds(user.id),
    enabled: isOpen && !!user?.id,
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isAdmin = 
    user?.role?.toLowerCase() === 'systemadmin' || 
    user?.role?.toLowerCase() === 'admin' || 
    user?.name === 'System Admin' ||
    user?.role === 'مسؤول النظام';

  return createPortal(
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-zain" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800 relative text-slate-800 dark:text-slate-100 font-zain"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Users size={18} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {t('ads.viewUserModal.title') || 'تفاصيل بيانات العميل'}
                </h3>
              </div>
              
              <button 
                type="button"
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-grow custom-scrollbar">
              
              {/* User Main Card */}
              <div className="flex items-center gap-4 bg-slate-50/90 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xl border border-sky-500/20 shadow-xs flex-shrink-0">
                  {user.name ? user.name.charAt(0) : <Users size={24} />}
                </div>
                <div className="text-right flex flex-col flex-grow min-w-0">
                  <span className="font-black text-slate-900 dark:text-slate-100 text-base sm:text-lg truncate">
                    {user.name || t('ads.noName') || 'بدون اسم'}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">
                      #{user.id}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-end shrink-0">
                  {user.status?.toLowerCase() === 'active' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                      <CheckCircle2 size={13} />
                      <span>{t('common.active') || 'نشط'}</span>
                    </span>
                  ) : user.status?.toLowerCase() === 'suspended' ? (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                      <X size={13} />
                      <span>{t('common.suspended') || 'معطل'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Clock size={13} />
                      <span>{t('common.pending') || 'معلق'}</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                    <Shield size={13} />
                    <span>{t(`ads.viewUserModal.roles.${user.role?.toLowerCase()}`, { defaultValue: user.role })}</span>
                  </span>
                </div>
              </div>

              {/* Facility Section - Hidden for System Admin & when fields are null */}
              {!isAdmin && (user.namePlace || user.addressPlace || user.cityPlace || user.countryPlace) && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={15} className="text-indigo-500" />
                    <span>{t('ads.viewUserModal.facilitySection') || 'بيانات المنشأة / العيادة'}</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    {user.namePlace && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-bold">{t('ads.viewUserModal.facilityName') || 'اسم المنشأة'}</span>
                        <span className="font-black text-slate-800 dark:text-slate-100">{user.namePlace}</span>
                      </div>
                    )}
                    {user.addressPlace && (
                      <>
                        {user.namePlace && <div className="h-px bg-slate-200/60 dark:bg-slate-700/60" />}
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-slate-500 dark:text-slate-400 font-bold">{t('ads.viewUserModal.locationAddress') || 'الموقع / العنوان'}</span>
                          <span className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                            <MapPin size={14} className="text-rose-500 shrink-0" />
                            <span>{user.addressPlace}</span>
                          </span>
                        </div>
                      </>
                    )}
                    {(user.cityPlace || user.countryPlace) && (
                      <>
                        {(user.namePlace || user.addressPlace) && <div className="h-px bg-slate-200/60 dark:bg-slate-700/60" />}
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-slate-500 dark:text-slate-400 font-bold">{t('ads.viewUserModal.cityAndCountry') || 'المدينة والبلد'}</span>
                          <span className="font-black text-slate-800 dark:text-slate-100">
                            {user.cityPlace}
                            {user.countryPlace ? `، ${user.countryPlace}` : ""}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Section - Hidden for System Admin & when phone is null */}
              {!isAdmin && user.phone && user.phone !== '-' && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={15} className="text-emerald-500" />
                    <span>{t('ads.viewUserModal.contactSection') || 'بيانات التواصل والاتصال'}</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">{t('ads.viewUserModal.phone') || 'رقم الهاتف'}</span>
                      <span className="font-black text-slate-800 dark:text-slate-100 font-mono dir-ltr select-all">
                        {user.phone}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* History Section */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={15} className="text-sky-500" />
                  <span>{t('ads.viewUserModal.accountHistorySection') || 'سجل الحساب والنشاط'}</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">{t('ads.viewUserModal.createdAt') || 'تاريخ الإنشاء'}</span>
                    <span className="font-black text-slate-800 dark:text-slate-100">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="h-px bg-slate-200/60 dark:bg-slate-700/60" />
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">{t('ads.viewUserModal.totalAds') || 'إجمالي الحملات الإعلانية'}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Megaphone size={14} />
                      <span>{user.advertisementsCount || 0} إعلانات</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Ads Section */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Megaphone size={15} className="text-amber-500 animate-pulse" />
                  <span>{t('ads.viewUserModal.activeAdsSection', { count: adsData?.totalCount || 0 }) || 'الحملات الإعلانية النشطة'}</span>
                </h4>

                {isLoadingAds ? (
                  <div className="flex items-center justify-center p-8 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 gap-2">
                    <Loader2 size={18} className="text-sky-500 animate-spin" />
                    <span className="text-xs text-slate-500 font-bold">{t('ads.viewUserModal.loadingAds') || 'جاري تحميل الإعلانات...'}</span>
                  </div>
                ) : adsData?.advertisements?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {adsData.advertisements.map((ad) => (
                      <div 
                        key={ad.id} 
                        className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                      >
                        {ad.imageUrl && (
                          <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img 
                              src={ad.imageUrl} 
                              alt={ad.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                              #{ad.id}
                            </div>
                            {ad.price && (
                              <div className="absolute bottom-2.5 left-2.5 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                                {ad.price.toLocaleString()} ل.س
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="p-4 flex flex-col gap-2">
                          <h5 className="font-black text-slate-900 dark:text-slate-100 text-sm">{ad.title || t('ads.viewUserModal.untitledAd') || 'إعلان بدون عنوان'}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{ad.content || t('ads.viewUserModal.noContent') || 'لا يوجد محتوى تفصيلي'}</p>

                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                          <div className="flex justify-between items-center text-xs text-slate-400 font-bold gap-2 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{formatDate(ad.createdAt)}</span>
                            </span>
                            <span className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                              <Clock size={12} />
                              <span>ينتهي: {formatDate(ad.expiresAt)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400 font-bold">
                    {adsData?.message || t('ads.viewUserModal.noActiveAds') || 'لا توجد إعلانات نشطة حالياً لهذا العميل.'}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex-shrink-0">
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-sm rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {t('common.close') || 'إغلاق'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ViewUserModal;
