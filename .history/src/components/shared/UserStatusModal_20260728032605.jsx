import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Check, 
  FlaskConical, 
  MapPin, 
  Eye, 
  ShieldAlert 
} from 'lucide-react';

// خريطة تحويل متكاملة للربط بين النصوص والأرقام
const STATUS_LOOKUP = {
  'pendingverification': 0,
  'pendingadminapproval': 1,
  'pending': 1,
  'active': 2,
  'readonly': 3,
  'suspended': 4,
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4
};

// قائمة الحالات الخمس المعتمدة (مُعرّفة خارج المكوّن لمنع إعادة الإنشاء عند كل Render)
const ALL_STATUSES = [
  {
    value: 0,
    code: 'PendingVerification',
    label: 'قيد التثبت (Pending Verification)',
    icon: ShieldAlert,
    styles: {
      activeBorder: 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/15 ring-orange-500/20',
      activeIconBg: 'bg-orange-500 text-white',
      inactiveIconBg: 'bg-orange-50 text-orange-600',
      checkColor: 'text-orange-500',
    },
  },
  {
    value: 1,
    code: 'PendingAdminApproval',
    label: 'قيد مراجعة الأدمن (Pending Admin Approval)',
    icon: Clock,
    styles: {
      activeBorder: 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/15 ring-amber-500/20',
      activeIconBg: 'bg-amber-500 text-white',
      inactiveIconBg: 'bg-amber-50 text-amber-600',
      checkColor: 'text-amber-500',
    },
  },
  {
    value: 2,
    code: 'Active',
    label: 'نشط (Active)',
    icon: CheckCircle2,
    styles: {
      activeBorder: 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/15 ring-emerald-500/20',
      activeIconBg: 'bg-emerald-500 text-white',
      inactiveIconBg: 'bg-emerald-50 text-emerald-600',
      checkColor: 'text-emerald-500',
    },
  },
  {
    value: 3,
    code: 'ReadOnly',
    label: 'قراءة فقط (Read Only)',
    icon: Eye,
    styles: {
      activeBorder: 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/15 ring-indigo-500/20',
      activeIconBg: 'bg-indigo-500 text-white',
      inactiveIconBg: 'bg-indigo-50 text-indigo-600',
      checkColor: 'text-indigo-500',
    },
  },
  {
    value: 4,
    code: 'Suspended',
    label: 'معلق (Suspended)',
    icon: AlertTriangle,
    styles: {
      activeBorder: 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/15 ring-rose-500/20',
      activeIconBg: 'bg-rose-500 text-white',
      inactiveIconBg: 'bg-rose-50 text-rose-600',
      checkColor: 'text-rose-500',
    },
  },
];

const UserStatusModal = ({ isOpen, user, type, onClose, tempStatus, setTempStatus, onConfirm }) => {
  const { t } = useTranslation();

  const isDoctor = type === 'doctor';

  const normalizeStatus = (val) => {
    if (val === null || val === undefined) return null;
    const key = String(val).toLowerCase().trim();
    return STATUS_LOOKUP[key] ?? null;
  };

  const currentTempNumeric = normalizeStatus(tempStatus);
  const userOriginalNumeric = normalizeStatus(user?.status);

  // 🔍 طباعة تفاصيل الحالات في الكونسول بثبات وبدون خطأ الحجم
  useEffect(() => {
    if (isOpen && user) {
      console.log('📋 ===== [ UserStatusModal Status List ] =====');
      ALL_STATUSES.forEach((st) => {
        console.log(`🔢 Enum: [${st.value}] ➔ Code: "${st.code}" | Label: "${st.label}"`);
      });
      console.log('----------------------------------------------');
      console.log(`👤 Original User Status: "${user.status}" ➔ Parsed Enum: [${userOriginalNumeric}]`);
      console.log(`⏱️ Current Temp Status in Modal: [${currentTempNumeric}]`);
      console.log('==============================================');
    }
  }, [isOpen, user, tempStatus, currentTempNumeric, userOriginalNumeric]);

  if (typeof document === 'undefined' || !document.body) return null;

  const isSaveDisabled = currentTempNumeric === userOriginalNumeric || currentTempNumeric === null;

  return createPortal(
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-black text-gray-800 dark:text-gray-100">
                  {isDoctor ? t('userStatusModal.editDoctorStatus') : t('userStatusModal.editLabStatus')}
                </h3>
                <p className="text-[11px] text-gray-400 dark:text-slate-400 font-medium">
                  {isDoctor ? t('userStatusModal.chooseDoctorStatus') : t('userStatusModal.chooseLabStatus')}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* User Info Bar */}
            <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-sky-50/40 dark:bg-slate-800/30 border border-sky-100/20 dark:border-slate-800/40 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl overflow-hidden border shrink-0 flex items-center justify-center font-bold ${
                  isDoctor
                    ? 'border-primary/20 bg-sky-100 dark:bg-sky-950 text-primary'
                    : 'border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950 text-emerald-600'
                }`}
              >
                {isDoctor ? (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Doctor')}&background=e0f2fe&color=367AFF&bold=true&size=64`}
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
                      {user.clinicName || 'العيادة غير محددة'}
                    </>
                  ) : (
                    <>
                      <MapPin size={11} className="text-emerald-500" />
                      {user.address || 'العنوان غير محدد'}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* الخيارات الـ 5 */}
            <div className="flex flex-col gap-2 px-6 py-4 max-h-[360px] overflow-y-auto">
              {ALL_STATUSES.map((item) => {
                const IconComponent = item.icon;
                const active = currentTempNumeric === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      console.log(`👉 Selected New Option ➔ Enum Value: ${item.value} ("${item.code}")`);
                      setTempStatus(item.value);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      active
                        ? `${item.styles.activeBorder} shadow-sm ring-1`
                        : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                        active ? item.styles.activeIconBg : item.styles.inactiveIconBg
                      }`}
                    >
                      <IconComponent size={15} />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                      <span className="text-xs font-black text-gray-800 dark:text-gray-100">{item.label}</span>
                    </div>
                    {active && <Check size={14} className={`${item.styles.checkColor} self-center`} />}
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-gray-500 bg-white dark:bg-slate-900 active:scale-95 transition-all cursor-pointer"
              >
                {t('common.cancel')}
              </button>
             <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    // 💡 نمرر القيمة الرقمية المحددة صراحةً للدالة onConfirm
    onConfirm(currentTempNumeric);
  }}
  disabled={isSaveDisabled}
  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:scale-95 transition-all cursor-pointer ${
    isSaveDisabled
      ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed text-gray-400'
      : 'bg-primary hover:bg-primary/95'
  }`}
>
  {t('userStatusModal.saveStatus')}
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