import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, Phone, MapPin, Building2, Calendar, 
  Loader2, Star, CheckCircle2, XCircle, Award, Sparkles, Shield
} from 'lucide-react';

const getStatusConfig = (status) => {
  const cleanStatus = typeof status === 'string' ? status.toLowerCase() : '';
  if (cleanStatus === 'active') {
    return {
      label: 'نشط',
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
      dot: 'bg-emerald-500 animate-pulse'
    };
  }
  if (cleanStatus === 'pendingadminapproval' || cleanStatus === 'pending') {
    return {
      label: 'بانتظار الموافقة',
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
      dot: 'bg-amber-500'
    };
  }
  if (cleanStatus === 'suspended') {
    return {
      label: 'معلق',
      color: 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800',
      dot: 'bg-slate-400'
    };
  }
  if (cleanStatus === 'rejected') {
    return {
      label: 'مرفوض',
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
      dot: 'bg-rose-500'
    };
  }
  return {
    label: status || 'غير محدد',
    color: 'bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800',
    dot: 'bg-gray-400'
  };
};

const LabDetailsModal = ({ lab, isOpen, onClose, isLoading }) => {
  if (typeof document === 'undefined') return null;

  // Rating Stars Renderer
  const renderStars = (rating = 0) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<Star key={i} size={18} fill="#F59E0B" className="text-amber-500" />);
      } else if (i - 0.5 === roundedRating) {
        stars.push(
          <div key={i} className="relative inline-block">
            <Star size={18} className="text-gray-200 dark:text-slate-700" />
            <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden w-[50%]">
              <Star size={18} fill="#F59E0B" className="text-amber-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={18} className="text-gray-200 dark:text-slate-700" />);
      }
    }
    return stars;
  };

  // Availability Translater
  const getAvailabilityInfo = (status) => {
    // AvailabilityStatus: Available = 0, Busy = 1, NotAvailable = 2
    // It can also come as strings: 'Available', 'Busy', 'NotAvailable'
    const cleanStatus = typeof status === 'string' ? status.toLowerCase() : status;
    if (cleanStatus === 'available' || cleanStatus === 0) {
      return {
        label: 'متوفر للعمل',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40',
        dot: 'bg-emerald-500'
      };
    }
    if (cleanStatus === 'busy' || cleanStatus === 1) {
      return {
        label: 'مشغول حالياً',
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40',
        dot: 'bg-amber-500'
      };
    }
    return {
      label: 'غير متاح حالياً',
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40',
      dot: 'bg-rose-500'
    };
  };

  const availability = lab ? getAvailabilityInfo(lab.availability) : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
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
            
            {/* ── Loading State ── */}
            {isLoading ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <Loader2 size={60} className="text-emerald-500 animate-spin" />
                  <div className="absolute inset-0 blur-2xl bg-emerald-500/20 animate-pulse rounded-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-text-main dark:text-gray-100 mb-1">جاري جلب بيانات المخبر</h3>
                  <p className="text-gray-400 dark:text-slate-500 text-sm font-bold">يرجى الانتظار قليلاً...</p>
                </div>
              </div>
            ) : lab ? (
              <>
                {/* Header Banner */}
                <div className="relative h-44 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-8 sm:p-10 flex items-end justify-between overflow-hidden">
                  <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-black/15 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <motion.div 
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white border border-white/30 shadow-2xl shrink-0"
                    >
                      <Building2 size={40} />
                    </motion.div>
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-white min-w-0"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold py-1.5 px-3.5 rounded-full tracking-widest leading-none inline-block">
                          مخبر رقم #{lab.id}
                        </span>
                        {lab.owner?.status && (() => {
                          const statusCfg = getStatusConfig(lab.owner.status);
                          return (
                            <span className="text-[10px] bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold py-1.5 px-3.5 rounded-full tracking-widest leading-none inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              الحالة: {statusCfg.label}
                            </span>
                          );
                        })()}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none truncate mb-1">
                        {lab.owner?.namePlace || lab.owner?.name || 'مخبر تعويضات'}
                      </h2>
                    </motion.div>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all hover:rotate-90 backdrop-blur-xl border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-8 sm:p-10 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                    
                    {/* Right side: Lab Profile Info */}
                    <motion.section 
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-gray-200 dark:bg-slate-800" />
                        الملف المهني للمخبر
                      </h3>
                      
                      {/* Availability Tag */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Shield size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-1">حالة التوفر</span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${availability.color}`}>
                            <span className={`w-2 h-2 rounded-full ${availability.dot}`} />
                            {availability.label}
                          </span>
                        </div>
                      </div>

                      {/* Account Status Tag */}
                      {lab.owner?.status && (() => {
                        const statusCfg = getStatusConfig(lab.owner.status);
                        return (
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                              <Shield size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-black mb-1">حالة الحساب</span>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${statusCfg.color}`}>
                                <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                                {statusCfg.label}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Average Rating */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Star size={20} className="text-amber-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-1">متوسط التقييم</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex">{renderStars(lab.averageRating)}</div>
                            <span className="text-sm font-bold text-text-main dark:text-gray-300">({lab.averageRating?.toFixed(1) || '0.0'})</span>
                          </div>
                        </div>
                      </div>

                      {/* Years of Experience */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Award size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-0.5">سنوات الخبرة</span>
                          <span className="text-[15px] text-text-main dark:text-gray-200 font-bold">
                            {lab.yearsOfExperience} سنوات خبرة عملية
                          </span>
                        </div>
                      </div>

                      {/* Scan Visit Service */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Sparkles size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-0.5">خدمة زيارة الفحص الرقمي (Scan Visit)</span>
                          <span className="flex items-center gap-1.5 text-sm font-bold text-text-main dark:text-gray-200">
                            {lab.hasScanVisitService ? (
                              <>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                يدعم خدمة الزيارة الرقمية للعيادة
                              </>
                            ) : (
                              <>
                                <XCircle size={16} className="text-gray-400" />
                                لا يوفر هذه الخدمة حالياً
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.section>

                    {/* Left side: Owner & Location Info */}
                    <motion.section 
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-gray-200 dark:bg-slate-800" />
                        بيانات المالك والتواصل
                      </h3>

                      {/* Owner Name */}
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-0.5">اسم المسؤول</span>
                          <span className="text-[15px] text-text-main dark:text-gray-200 font-bold">{lab.owner?.name || 'غير متوفر'}</span>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Mail size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-0.5">البريد الإلكتروني</span>
                          <span className="text-[14px] text-text-main dark:text-gray-300 font-bold truncate max-w-[220px] font-sans">{lab.owner?.email || 'غير متوفر'}</span>
                        </div>
                      </div>

                      
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-0.5">رقم الهاتف</span>
                          <span className="text-[15px] text-text-main dark:text-gray-200 font-bold font-sans">{lab.owner?.phone || 'غير متوفر'}</span>
                        </div>
                      </div>

                      
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black mb-0.5">العنوان والمنطقة</span>
                          <span className="text-[14px] text-text-main dark:text-gray-200 font-bold">
                            {[lab.owner?.addressPlace, lab.owner?.cityPlace, lab.owner?.countryPlace].filter(Boolean).join('، ') || 'غير متوفر'}
                          </span>
                        </div>
                      </div>
                    </motion.section>
                  </div>

                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8"
                  >
                    
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[13px] font-black text-text-main dark:text-gray-300">التخصصات والخدمات الموفرة:</h4>
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
                          <span className="text-xs text-gray-400">غير محدد</span>
                        )}
                      </div>
                    </div>

                   
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[13px] font-black text-text-main dark:text-gray-300">المواد المستخدمة والأجهزة:</h4>
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
                          <span className="text-xs text-gray-400">غير محدد</span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Lab
                  {lab.description && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase mb-2">وصف وتعريف بالمخبر:</h4>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">
                        {lab.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Joined Date Footer */}
                  <div className="mt-8 pt-4 border-t border-slate-50 dark:border-slate-800/40 text-center text-xs text-gray-400 dark:text-slate-500">
                    <span className="flex items-center justify-center gap-1.5">
                      <Calendar size={14} />
                      تاريخ التسجيل المعتمد: {lab.owner?.createdAt ? new Date(lab.owner.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'غير متوفر'}
                    </span>
                  </div>

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

export default LabDetailsModal;
