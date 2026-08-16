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
  Eye,
  ShieldAlert,
  User,
  SlidersHorizontal,
  CreditCard
} from 'lucide-react';
const STATUS_LOOKUP = {
  'pendingverification': 0,
  'pendingadminapproval': 1,
  'pending': 1,
  'pendingpayment': 2,
  'active': 3,
  'readonly': 4,
  'suspended': 5,
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5
};

const ALL_STATUSES = [
  // {
  //   value: 0,
  //   code: 'PendingVerification',
  //   translationKey: 'userStatusModal.pendingVerificationStatus',
  //   label: 'قيد التثبت (Pending Verification)',
  //   icon: ShieldAlert,
  //   styles: {
  //     activeBorder: 'border-orange-500 bg-gradient-to-r from-orange-500/12 via-orange-500/5 to-transparent ring-2 ring-orange-500/25 shadow-sm',
  //     activeIconBg: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25',
  //     inactiveIconBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30',
  //     activeBadge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30',
  //     checkBg: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white',
  //   },
  // },
  {
    value: 1,
    code: 'PendingAdminApproval',
    translationKey: 'userStatusModal.pendingAdminApprovalStatus',
    label: 'قيد مراجعة الأدمن (Pending Admin Approval)',
    icon: Clock,
    styles: {
      activeBorder: 'border-amber-500 bg-gradient-to-r from-amber-500/12 via-amber-500/5 to-transparent ring-2 ring-amber-500/25 shadow-sm',
      activeIconBg: 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/25',
      inactiveIconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30',
      activeBadge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
      checkBg: 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white',
    },
  },
  // {
  //   value: 2,
  //   code: 'PendingPayment',
  //   translationKey: 'userStatusModal.pendingPaymentStatus',
  //   label: 'بانتظار الدفع (Pending Payment)',
  //   icon: CreditCard,
  //   labOnly: true,
  //   styles: {
  //     activeBorder: 'border-purple-500 bg-gradient-to-r from-purple-500/12 via-purple-500/5 to-transparent ring-2 ring-purple-500/25 shadow-sm',
  //     activeIconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/25',
  //     inactiveIconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/30',
  //     activeBadge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30',
  //     checkBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white',
  //   },
  // },
  {
    value: 3,
    code: 'Active',
    translationKey: 'userStatusModal.activeStatus',
    label: 'نشط (Active)',
    icon: CheckCircle2,
    styles: {
      activeBorder: 'border-emerald-500 bg-gradient-to-r from-emerald-500/12 via-emerald-500/5 to-transparent ring-2 ring-emerald-500/25 shadow-sm',
      activeIconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25',
      inactiveIconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30',
      activeBadge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
      checkBg: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white',
    },
  },
  {
    value: 4,
    code: 'ReadOnly',
    translationKey: 'userStatusModal.readOnlyStatus',
    label: 'قراءة فقط (Read Only)',
    icon: Eye,
    styles: {
      activeBorder: 'border-indigo-500 bg-gradient-to-r from-indigo-500/12 via-indigo-500/5 to-transparent ring-2 ring-indigo-500/25 shadow-sm',
      activeIconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25',
      inactiveIconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30',
      activeBadge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30',
      checkBg: 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white',
    },
  },
  {
    value: 5,
    code: 'Suspended',
    translationKey: 'userStatusModal.suspendedStatus',
    label: 'معلق (Suspended)',
    icon: AlertTriangle,
    styles: {
      activeBorder: 'border-rose-500 bg-gradient-to-r from-rose-500/12 via-rose-500/5 to-transparent ring-2 ring-rose-500/25 shadow-sm',
      activeIconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25',
      inactiveIconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30',
      activeBadge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30',
      checkBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white',
    },
  },
];

const parseLabel = (rawLabel) => {
  if (!rawLabel) return { ar: '', en: '' };
  const match = rawLabel.match(/^(.*?)\s*(?:\((.*?)\))?$/);
  if (match && match[2]) {
    return {
      ar: match[1]?.trim() || rawLabel,
      en: match[2]?.trim() || '',
    };
  }
  return { ar: rawLabel, en: '' };
};

const UserStatusModal = ({ isOpen, user, type, onClose, tempStatus, setTempStatus, onConfirm }) => {
  const { t } = useTranslation();
  const isDoctor = type === 'doctor' || type === 'dentist';
  const isLabTechnician = type === 'labTechnician';

  const visibleStatuses = isDoctor ? ALL_STATUSES.filter((item) => !item.labOnly) : ALL_STATUSES;

  const normalizeStatus = (val) => {
    if (val === null || val === undefined) return null;
    const key = String(val).toLowerCase().trim();
    return STATUS_LOOKUP[key] ?? null;
  };

  const currentTempNumeric =
    typeof tempStatus === "number"
      ? tempStatus
      : normalizeStatus(tempStatus);

  const userOriginalNumeric =
    typeof user?.status === "number"
      ? user.status
      : normalizeStatus(user?.status);

  useEffect(() => {
    if (isOpen && user) {
      ALL_STATUSES.forEach((st) => {
        console.log(`🔢 Enum: [${st.value}] ➔ Code: "${st.code}" | Label: "${st.label}"`);
      });
    }
  }, [isOpen, user, tempStatus, currentTempNumeric, userOriginalNumeric]);

  useEffect(() => {
    console.log("tempStatus Changed =", tempStatus);
  }, [tempStatus]);

  if (typeof document === 'undefined' || !document.body) return null;

  const isSaveDisabled = currentTempNumeric === userOriginalNumeric || currentTempNumeric === null;

  return createPortal(
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', damping: 24, stiffness: 340 }}
            className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-10 flex flex-col text-right font-sans my-auto ring-1 ring-slate-950/5 dark:ring-white/10 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sky-400/50 before:to-transparent"
            dir="rtl"
          >
            <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/90 to-white dark:from-slate-900/90 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs shrink-0">
                  <SlidersHorizontal size={17} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-zain text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {isDoctor
                      ? (t('userStatusModal.editDoctorStatus') || 'تعديل حالة حساب الطبيب')
                      : isLabTechnician
                        ? (t('userStatusModal.editLabTechStatus') || 'تعديل حالة حساب المخبري')
                        : (t('userStatusModal.editLabStatus') || 'تعديل حالة حساب المخبر')}
                  </h3>
                  <p className="font-zain text-xs text-slate-400 dark:text-slate-400 font-medium">
                    {isDoctor
                      ? (t('userStatusModal.chooseDoctorStatus') || 'اختر الحالة الجديدة لحساب الطبيب')
                      : isLabTechnician
                        ? (t('userStatusModal.chooseLabTechStatus') || 'اختر الحالة الجديدة لحساب المخبري المحدد أدناه')
                        : (t('userStatusModal.chooseLabStatus') || 'اختر الحالة الجديدة لحساب المخبر المحدد أدناه')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-all cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mx-5 sm:mx-6 my-3 p-3 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/20 to-indigo-50/20 dark:from-slate-800/50 dark:via-slate-800/30 dark:to-slate-800/20 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center font-bold shadow-xs ${isDoctor
                      ? 'border-sky-500/30 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 ring-2 ring-sky-500/10'
                      : 'border-indigo-500/30 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/10'
                    }`}
                >
                  {isDoctor ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Doctor')}&background=e0f2fe&color=367AFF&bold=true&size=64`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={19} className="text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="font-zain font-black text-slate-800 dark:text-slate-100 text-sm leading-tight truncate">
                    {user.name}
                  </span>
                  <span className="font-zain text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 flex items-center gap-1 truncate">
                    <Building2 size={12} className={isDoctor ? 'text-sky-500 shrink-0' : 'text-indigo-500 shrink-0'} />
                    <span className="truncate">
                      {isDoctor
                        ? (user.clinicName || t('userStatusModal.clinicNotSpecified') || 'العيادة غير محددة')
                        : (user.namePlace || t('userStatusModal.addressNotSpecified') || 'مكان العمل غير محدد')}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-5 sm:px-6 py-1">
              {visibleStatuses.map((item) => {
                const IconComponent = item.icon;
                const active = currentTempNumeric === item.value;
                const rawText = item.translationKey ? t(item.translationKey) : item.label;
                const { ar, en } = parseLabel(rawText);

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      console.log(`👉 Selected New Option ➔ Enum Value: ${item.value} ("${item.code}")`);
                      setTempStatus(item.value);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border text-right transition-all duration-200 cursor-pointer group ${active
                        ? `${item.styles.activeBorder}`
                        : 'border-slate-200/70 dark:border-slate-800/80 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-all duration-200 ${active
                            ? item.styles.activeIconBg
                            : `${item.styles.inactiveIconBg} group-hover:scale-105`
                          }`}
                      >
                        <IconComponent size={16} />
                      </div>
                      <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                        <span className="font-zain text-sm font-black text-slate-800 dark:text-slate-100 whitespace-nowrap">
                          {ar}
                        </span>
                        {en && (
                          <span
                            className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-md tracking-tight whitespace-nowrap transition-colors ${active
                                ? item.styles.activeBadge
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/50'
                              }`}
                          >
                            {en}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${active
                          ? `${item.styles.checkBg} scale-100 shadow-xs`
                          : 'border-2 border-slate-300 dark:border-slate-700 opacity-40 group-hover:opacity-75 group-hover:border-slate-400'
                        }`}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-5 sm:px-6 py-3.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold font-zain text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Saving Status =", tempStatus);
                  onConfirm(tempStatus);
                }}
                disabled={isSaveDisabled}
                className={`px-6 py-2 rounded-xl text-xs font-black font-zain text-white active:scale-95 transition-all cursor-pointer ${isSaveDisabled
                    ? 'bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-not-allowed text-slate-400 dark:text-slate-600'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-md shadow-sky-500/25 hover:shadow-lg'
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