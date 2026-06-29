import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, CheckCircle2, AlertTriangle, Clock, Check, FlaskConical, MapPin } from 'lucide-react';

const UserStatusModal = ({ isOpen, user, type, onClose, tempStatus, setTempStatus, onConfirm }) => {
  if (typeof document === 'undefined' || !document.body) return null;

  const isDoctor = type === 'doctor';

  return createPortal(
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col text-right font-sans"
            dir="rtl"
          >
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-black text-gray-800 dark:text-gray-100">
                  {isDoctor ? 'تعديل حالة حساب الطبيب' : 'تعديل حالة حساب المخبر'}
                </h3>
                <p className="text-[11px] text-gray-400 dark:text-slate-400 font-medium">
                  {isDoctor ? 'اختر الحالة الجديدة لحساب الطبيب المحدد أدناه' : 'اختر الحالة الجديدة لحساب المخبر المحدد أدناه'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            
            <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-sky-50/40 dark:bg-slate-800/30 border border-sky-100/20 dark:border-slate-800/40 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl overflow-hidden border shrink-0 flex items-center justify-center font-bold ${
                isDoctor 
                  ? 'border-primary/20 bg-sky-100 dark:bg-sky-950 text-primary' 
                  : 'border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450'
              }`}>
                {isDoctor ? (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'طبيب')}&background=e0f2fe&color=367AFF&bold=true&size=64`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FlaskConical size={20} className="text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-gray-800 dark:text-gray-100 text-xs leading-tight">{user.name}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1">
                  {isDoctor ? (
                    <>
                      <Building2 size={11} className="text-sky-500" />
                      {user.clinicName || 'عيادة غير محددة'}
                    </>
                  ) : (
                    <>
                      <MapPin size={11} className="text-emerald-500" />
                      {user.address || 'عنوان غير محدد'}
                    </>
                  )}
                </span>
              </div>
            </div>

            
            <div className="flex flex-col gap-2.5 px-6 py-5">
              
              
              <button
                type="button"
                onClick={() => setTempStatus('Active')}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer ${
                  tempStatus?.toLowerCase() === 'active'
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/15 shadow-sm ring-1 ring-emerald-500/20'
                    : 'border-slate-100 dark:border-slate-800/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${tempStatus?.toLowerCase() === 'active' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'}`}>
                  <CheckCircle2 size={15} />
                </div>
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <span className="text-xs font-black text-gray-800 dark:text-gray-100">نشط (Active)</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed font-sans">
                    {isDoctor 
                      ? 'تفعيل الحساب ليتمكن الطبيب من استخدام خدمات المنصة والعيادة.'
                      : 'تفعيل الحساب ليتمكن المخبر من استخدام خدمات المنصة واستلام الطلبات.'}
                  </span>
                </div>
                {tempStatus?.toLowerCase() === 'active' && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 self-center">
                    <Check size={10} />
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setTempStatus('Suspended')}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer ${
                  tempStatus?.toLowerCase() === 'suspended'
                    ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/15 shadow-sm ring-1 ring-rose-500/20'
                    : 'border-slate-100 dark:border-slate-800/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${tempStatus?.toLowerCase() === 'suspended' ? 'bg-rose-500 text-white' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'}`}>
                  <AlertTriangle size={15} />
                </div>
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <span className="text-xs font-black text-gray-800 dark:text-gray-100">معلق (Suspended)</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed font-sans">
                    {isDoctor
                      ? 'تعطيل الحساب مؤقتاً ولن يتمكن الطبيب من تسجيل الدخول للمنصة.'
                      : 'تعطيل الحساب مؤقتاً ولن يتمكن المخبر من تسجيل الدخول للمنصة.'}
                  </span>
                </div>
                {tempStatus?.toLowerCase() === 'suspended' && (
                  <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 self-center">
                    <Check size={10} />
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setTempStatus('PendingAdminApproval')}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer ${
                  tempStatus?.toLowerCase() === 'pendingadminapproval' || tempStatus?.toLowerCase() === 'pending'
                    ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/15 shadow-sm ring-1 ring-amber-500/20'
                    : 'border-slate-100 dark:border-slate-800/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${tempStatus?.toLowerCase() === 'pendingadminapproval' || tempStatus?.toLowerCase() === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'}`}>
                  <Clock size={15} />
                </div>
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <span className="text-xs font-black text-gray-800 dark:text-gray-100">قيد المراجعة (Pending)</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed font-sans">
                    {isDoctor
                      ? 'إعادة الطبيب لمرحلة مراجعة الوثائق بانتظار موافقة الإدارة.'
                      : 'إعادة المخبر لمرحلة مراجعة الوثائق بانتظار موافقة الإدارة.'}
                  </span>
                </div>
                {(tempStatus?.toLowerCase() === 'pendingadminapproval' || tempStatus?.toLowerCase() === 'pending') && (
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 self-center">
                    <Check size={10} />
                  </div>
                )}
              </button>
            </div>

            
            <div className="px-6 py-4.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-gray-500 dark:text-slate-455 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={tempStatus === user.status}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:scale-95 transition-all cursor-pointer ${
                  tempStatus === user.status
                    ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed text-gray-400 dark:text-slate-500 shadow-none'
                    : 'bg-primary hover:bg-primary/95'
                }`}
              >
                حفظ الحالة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default UserStatusModal;
