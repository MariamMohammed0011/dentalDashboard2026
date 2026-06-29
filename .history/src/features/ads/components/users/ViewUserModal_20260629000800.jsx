import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Building2, MapPin, Shield, Calendar, Megaphone, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../../services/adsApi';

const roleTranslations = {
  ADSClient: 'عميل إعلانات',
  Dentist: 'طبيب أسنان',
  Lab: 'مختبر أسنان',
  Admin: 'مسؤول النظام',
};

const ViewUserModal = ({ isOpen, onClose, user }) => {
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
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-border-main/40 relative text-text-main"
          >
            
            <div className="flex justify-between items-center p-5 border-b border-border-main/30 flex-shrink-0">
              <h3 className="text-lg font-black text-text-main">تفاصيل بيانات العميل</h3>
              
              <button 
                onClick={onClose}
                className="p-2 bg-bg-main/50 hover:bg-bg-main text-text-muted hover:text-text-main rounded-xl transition-all active:scale-95 cursor-pointer border border-border-main/40"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            
            <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-grow custom-scrollbar">
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xl border border-primary/30 shadow-sm flex-shrink-0">
                  {user.name ? user.name.charAt(0) : <Users size={24} />}
                </div>
                <div className="text-right flex flex-col flex-grow">
                  <span className="font-extrabold text-text-main text-base sm:text-lg">{user.name || "بدون اسم"}</span>
                  <span className="text-xs text-text-muted font-semibold mt-1">معرف الحساب: #{user.id}</span>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  {/* Status Badge */}
                  {user.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                      <CheckCircle2 size={12} />
                      نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Clock size={12} />
                      قيد المراجعة
                    </span>
                  )}
                  {/* Role Badge */}
                  <span className="inline-flex items-center gap-1 text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full text-xs font-bold">
                    <Shield size={12} />
                    {roleTranslations[user.role] || user.role}
                  </span>
                </div>
              </div>

              {/* Clinic / Place Section */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Building2 size={14} className="text-primary" />
                  بيانات المنشأة / العيادة
                </h4>
                <div className="grid grid-cols-1 gap-3 bg-bg-main/20 p-4 rounded-2xl border border-border-main/30">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">اسم المنشأة</span>
                    <span className="font-bold text-text-main">{user.namePlace || "غير محدد"}</span>
                  </div>
                  <div className="h-px bg-border-main/20" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">الموقع / العنوان</span>
                    <span className="font-bold text-text-main flex items-center gap-1">
                      <MapPin size={14} className="text-text-muted/70" />
                      <span>{user.addressPlace || user.cityPlace || "غير محدد"}</span>
                    </span>
                  </div>
                  <div className="h-px bg-border-main/20" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">المدينة والبلد</span>
                    <span className="font-bold text-text-main">
                      {user.cityPlace || "دمشق"}
                      {user.countryPlace ? `، ${user.countryPlace}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Phone size={14} className="text-primary" />
                  بيانات التواصل والاتصال
                </h4>
                <div className="grid grid-cols-1 gap-3 bg-bg-main/20 p-4 rounded-2xl border border-border-main/30">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">رقم الهاتف</span>
                    <span className="font-bold text-text-main select-all font-mono" dir="ltr">
                      {user.phone || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Metrics and Dates */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={14} className="text-primary" />
                  تفاصيل تاريخ الحساب والنشاط
                </h4>
                <div className="grid grid-cols-1 gap-3 bg-bg-main/20 p-4 rounded-2xl border border-border-main/30">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">تاريخ الإنشاء</span>
                    <span className="font-bold text-text-main">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="h-px bg-border-main/20" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted font-medium">إجمالي الحملات الإعلانية</span>
                    <span className="font-black text-primary flex items-center gap-1">
                      <Megaphone size={14} />
                      <span>{user.advertisementsCount || 0} إعلان</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Advertisements Section */}
              <div className="flex flex-col gap-3 mt-2">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Megaphone size={14} className="text-primary animate-pulse" />
                  الإعلانات الفعالة للمستخدم ({adsData?.totalCount || 0})
                </h4>
                
                {isLoadingAds ? (
                  <div className="flex items-center justify-center p-8 bg-bg-main/20 rounded-2xl border border-border-main/30 gap-2">
                    <Loader2 size={18} className="text-primary animate-spin" />
                    <span className="text-xs text-text-muted font-bold">جاري تحميل الإعلانات...</span>
                  </div>
                ) : adsData?.advertisements?.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {adsData.advertisements.map((ad) => (
                      <div 
                        key={ad.id} 
                        className="bg-bg-card border border-border-main/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Ad Image */}
                        {ad.imageUrl && (
                          <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img 
                              src={ad.imageUrl} 
                              alt={ad.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg">
                              ID: #{ad.id}
                            </div>
                            {ad.price && (
                              <div className="absolute bottom-2.5 left-2.5 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                سعر الحملة: {ad.price.toLocaleString()} ر.س
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Ad Content */}
                        <div className="p-4 flex flex-col gap-2">
                          <h5 className="font-bold text-text-main text-sm">{ad.title || "إعلان بدون عنوان"}</h5>
                          <p className="text-xs text-text-muted font-medium leading-relaxed">{ad.content || "لا يوجد محتوى"}</p>
                          
                          <div className="h-px bg-border-main/20 my-1" />
                          
                          <div className="flex justify-between items-center text-[10px] text-text-muted font-bold gap-2 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              تاريخ الإنشاء: {formatDate(ad.createdAt)}
                            </span>
                            <span className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                              <Clock size={10} />
                              ينتهي في: {formatDate(ad.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-bg-main/20 rounded-2xl border border-border-main/30 text-xs text-text-muted font-bold">
                    {adsData?.message || "لا يوجد إعلانات فعالة حالياً لهذا المستخدم."}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t border-border-main/30 bg-bg-main/10 flex-shrink-0">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-all active:scale-95 cursor-pointer shadow-md shadow-primary/10"
              >
                إغلاق
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
