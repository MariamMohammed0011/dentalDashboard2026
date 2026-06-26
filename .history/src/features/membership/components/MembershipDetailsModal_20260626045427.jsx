import React from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, MapPin, Building2, Globe, FileText, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../../api/axios';

const MembershipDetailsModal = ({ request, isOpen, onClose, isLoading }) => {
  if (typeof document === 'undefined') return null;

  const isDoctor = request ? (request.role?.toLowerCase() === 'dentist' || request.type === 'doctor') : true;

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
                <div className={`relative h-40 bg-gradient-to-br ${
                  isDoctor 
                    ? 'from-[#367AFF] via-[#367AFF] to-[#0051FF]' 
                    : 'from-[#10B981] via-[#059669] to-[#047857]'
                } p-10 flex items-end justify-between overflow-hidden`}>
                  <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-black/20 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 flex items-center gap-4 sm:gap-6 pl-14 sm:pl-0">
                    <motion.div 
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white border border-white/30 shadow-2xl shrink-0"
                    >
                      <User size={28} className="sm:w-10 sm:h-10" />
                    </motion.div>
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-white min-w-0"
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mb-1.5 truncate">
                        {request.fullName || request.name || 'اسم غير معروف'}
                      </h2>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-white text-xs font-bold uppercase tracking-widest">
                         {request.role?.toLowerCase() === 'dentist' || request.type === 'doctor'
  ? 'طبيب أسنان'
  : 'مخبر تعويضات'}  </p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all hover:rotate-90 backdrop-blur-xl border border-white/10 z-[60] cursor-pointer"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
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
                        <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                          isDoctor 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <Mail size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">البريد الإلكتروني</span>
                          <span className="text-[15px] text-text-main font-bold truncate max-w-[200px]">{request.email || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-green-50 dark:bg-emerald-950/30 rounded-2xl text-green-600 dark:text-emerald-400 transition-all duration-300 group-hover:scale-110">
                          <Phone size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">رقم الهاتف</span>
                          <span className="text-[15px] text-text-main font-bold">{request.phoneNumber || request.phone || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110">
                          <Calendar size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">تاريخ الانضمام</span>
                          <span className="text-[15px] text-text-main font-bold">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en_Us', { dateStyle: 'long' }) : 'غير متوفر'}
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
                        <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl text-purple-600 dark:text-purple-400 transition-all duration-300 group-hover:scale-110">
                          <Building2 size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">اسم المنشأة</span>
                          <span className="text-[15px] text-text-main font-bold">{request.workplaceName || request.namePlace || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-orange-50 dark:bg-orange-950/30 rounded-2xl text-orange-600 dark:text-orange-400 transition-all duration-300 group-hover:scale-110">
                          <MapPin size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">العنوان</span>
                          <span className="text-[15px] text-text-main font-bold truncate max-w-[200px]">{request.address || request.addressPlace || 'غير متوفر'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group cursor-default">
                        <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl text-cyan-600 dark:text-cyan-400 transition-all duration-300 group-hover:scale-110">
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

                {/* Document Section - Hide completely if no document exists (common for lab technicians) */}
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
                      className="mt-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2.5rem] border border-gray-200/50 flex flex-col gap-6 group/doc hover:border-primary/30 transition-all duration-500 shadow-inner"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-primary shadow-xl group-hover/doc:rotate-6 transition-transform">
                            <FileText size={32} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-text-main mb-1 tracking-tight">وثيقة التحقق</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">تحقق من صحة المستندات المرفقة</p>
                          </div>
                        </div>

                        <a 
                          href={fullImageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`px-8 py-4 text-white text-[13px] font-black rounded-2xl transition-all hover:-translate-y-1 active:scale-95 ${
                            isDoctor 
                              ? 'bg-[#367AFF] shadow-[0_10px_30px_rgba(54,122,255,0.3)] hover:bg-[#0051FF]' 
                              : 'bg-[#10B981] shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:bg-[#047857]'
                          }`}
                        >
                          معاينة الوثيقة في علامة تبويب جديدة
                        </a>
                      </div>

                      {/* عرض الصورة مباشرةً داخل المودال لسهولة المعاينة الفورية */}
                      <div className="mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                        <img 
                          src={fullImageUrl} 
                          alt="Verification Document" 
                          className="w-full h-auto max-h-60 object-contain rounded-xl"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://placehold.co/600x400?text=خطأ+في+تحميل+الصورة';
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