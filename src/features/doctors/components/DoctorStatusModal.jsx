import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, CheckCircle2, AlertTriangle, Clock, Check } from 'lucide-react';

const DoctorStatusModal = ({ isOpen, doctor, onClose, tempStatus, setTempStatus, onConfirm }) => {
  if (typeof document === 'undefined' || !document.body) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && doctor && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col text-right font-sans"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-black text-gray-800 dark:text-gray-100">تعديل حالة حساب الطبيب</h3>
                <p className="text-[11px] text-gray-400 dark:text-slate-400 font-medium">اختر الحالة الجديدة لحساب الطبيب المحدد أدناه</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Doctor Details Quick Card */}
            <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-sky-50/40 dark:bg-slate-800/30 border border-sky-100/20 dark:border-slate-800/40 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-primary/20 shrink-0 bg-sky-100 dark:bg-sky-950 flex items-center justify-center font-bold">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'طبيب')}&background=e0f2fe&color=367AFF&bold=true&size=64`}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-gray-800 dark:text-gray-100 text-xs leading-tight">{doctor.name}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1">
                  <Building2 size={11} className="text-sky-500" />
                  {doctor.clinicName || 'عيادة غير محددة'}
                </span>
              </div>
            </div>

            {/* Status Option Cards */}
            <div className="flex flex-col gap-2.5 px-6 py-5">
              
              {/* Active Option */}
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
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed">تفعيل الحساب ليتمكن الطبيب من استخدام خدمات المنصة والعيادة.</span>
                </div>
                {tempStatus?.toLowerCase() === 'active' && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 self-center">
                    <Check size={10} />
                  </div>
                )}
              </button>

              {/* Suspended Option */}
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
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed">تعطيل الحساب مؤقتاً ولن يتمكن الطبيب من تسجيل الدخول للمنصة.</span>
                </div>
                {tempStatus?.toLowerCase() === 'suspended' && (
                  <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 self-center">
                    <Check size={10} />
                  </div>
                )}
              </button>

              {/* Pending Option */}
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
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed">إعادة الطبيب لمرحلة مراجعة الوثائق بانتظار موافقة الإدارة.</span>
                </div>
                {(tempStatus?.toLowerCase() === 'pendingadminapproval' || tempStatus?.toLowerCase() === 'pending') && (
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 self-center">
                    <Check size={10} />
                  </div>
                )}
              </button>
            </div>

            {/* Modal Footer Actions */}
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
                disabled={tempStatus === doctor.status}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:scale-95 transition-all cursor-pointer ${
                  tempStatus === doctor.status
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

export default DoctorStatusModal;
