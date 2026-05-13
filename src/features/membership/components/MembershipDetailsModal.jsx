import React from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, MapPin, Building2, Globe, FileText, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MembershipDetailsModal = ({ request, isOpen, onClose, isLoading }) => {
  if (typeof document === 'undefined') return null;

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
            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden z-10"
          >
            
            {/* ── حالة التحميل (Loading State) ── */}
            {isLoading ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6 bg-white">
                <div className="relative">
                  <Loader2 size={60} className="text-primary animate-spin" />
                  <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse rounded-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-text-main mb-1">جاري جلب البيانات</h3>
                  <p className="text-gray-400 text-sm font-bold">يرجى الانتظار قليلاً...</p>
                </div>
              </div>
            ) : request ? (
              <>
                {/* Header */}
                <div className="relative h-40 bg-gradient-to-br from-[#367AFF] via-[#367AFF] to-[#0051FF] p-10 flex items-end justify-between overflow-hidden">
                  <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-black/20 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <motion.div 
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white border border-white/30 shadow-2xl"
                    >
                      <User size={40} />
                    </motion.div>
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-white"
                    >
                      <h2 className="text-3xl font-black tracking-tight leading-none mb-2">
                        {request.fullName || request.name || 'اسم غير معروف'}
                      </h2>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-white text-xs font-bold uppercase tracking-widest">
                          {request.role === 'dentist' || request.type === 'doctor' ? 'طبيب أسنان' : 'مخبر تعويضات'}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all hover:rotate-90 backdrop-blur-xl border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-10 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Contact Info */}
                    <motion.section 
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-gray-200" />
                        معلومات التواصل
                      </h3>
                      
                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 group-hover:scale-110">
                          <Mail size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">البريد الإلكتروني</span>
                          <span className="text-[15px] text-text-main font-bold truncate max-w-[200px]">{request.email || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all duration-300 group-hover:scale-110">
                          <Phone size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">رقم الهاتف</span>
                          <span className="text-[15px] text-text-main font-bold">{request.phoneNumber || request.phone || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110">
                          <Calendar size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">تاريخ الانضمام</span>
                          <span className="text-[15px] text-text-main font-bold">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'long' }) : 'غير متوفر'}
                          </span>
                        </div>
                      </div>
                    </motion.section>

                    {/* Workplace Info */}
                    <motion.section 
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-gray-200" />
                        تفاصيل المقر
                      </h3>
                      
                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all duration-300 group-hover:scale-110">
                          <Building2 size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">اسم المنشأة</span>
                          <span className="text-[15px] text-text-main font-bold">{request.workplaceName || request.namePlace || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-300 group-hover:scale-110">
                          <MapPin size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">العنوان</span>
                          <span className="text-[15px] text-text-main font-bold truncate max-w-[200px]">{request.address || request.addressPlace || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all duration-300 group-hover:scale-110">
                          <Globe size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">المنطقة</span>
                          <span className="text-[15px] text-text-main font-bold">
                            {request.city || request.cityPlace} {request.country || request.countryPlace ? `/ ${request.country || request.countryPlace}` : ''}
                          </span>
                        </div>
                      </div>
                    </motion.section>
                  </div>

                  {/* Document Section */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2.5rem] border border-gray-200/50 flex items-center justify-between group/doc hover:border-primary/30 transition-all duration-500 shadow-inner"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-primary shadow-xl group-hover/doc:rotate-6 transition-transform">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-text-main mb-1 tracking-tight">وثيقة التحقق</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">تحقق من صحة المستندات المرفقة</p>
                      </div>
                    </div>
                    {request.documentUrl || request.verification_doc ? (
                      <a 
                        href={request.documentUrl || request.verification_doc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-[#367AFF] text-white text-[13px] font-black rounded-2xl shadow-[0_10px_30px_rgba(54,122,255,0.3)] hover:bg-[#0051FF] hover:-translate-y-1 transition-all active:scale-95"
                      >
                        معاينة الوثيقة
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm font-bold italic">لا توجد وثيقة</span>
                    )}
                  </motion.div>
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