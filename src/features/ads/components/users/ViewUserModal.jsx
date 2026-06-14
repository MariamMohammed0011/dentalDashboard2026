import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Building2, MapPin, Shield, Calendar, Megaphone, CheckCircle2, Clock } from 'lucide-react';

const roleTranslations = {
  ADSClient: 'عميل إعلانات',
  Dentist: 'طبيب أسنان',
  Lab: 'مختبر أسنان',
  Admin: 'مسؤول النظام',
};

const ViewUserModal = ({ isOpen, onClose, user }) => {
  if (typeof document === 'undefined') return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('ar-SY', {
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
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center p-5 border-b border-border-main/30 flex-shrink-0">
              <h3 className="text-lg font-black text-text-main">تفاصيل بيانات العميل</h3>
              
              <button 
                onClick={onClose}
                className="p-2 bg-bg-main/50 hover:bg-bg-main text-text-muted hover:text-text-main rounded-xl transition-all active:scale-95 cursor-pointer border border-border-main/40"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Content Body */}
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
