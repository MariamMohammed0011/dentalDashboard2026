import { useTranslation } from 'react-i18next';

export const useLabStatusConfig = () => {
  const { t } = useTranslation();

  return (status) => {
    const cleanStatus = typeof status === 'string' ? status.toLowerCase().trim() : String(status ?? '').toLowerCase().trim();

    if (cleanStatus === 'active' || cleanStatus === '2') {
      return {
        label: t('common.active') || 'نشط',
        color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
        dot: 'bg-emerald-500 animate-pulse'
      };
    }
    if (cleanStatus === 'pendingadminapproval' || cleanStatus === 'pending_admin_approval' || cleanStatus === 'pending' || cleanStatus === '1') {
      return {
        label: t('common.pendingAdminApproval') || t('common.pending') || 'قيد المراجعة',
        color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
        dot: 'bg-amber-500 animate-pulse'
      };
    }
    if (cleanStatus === 'pendingverification' || cleanStatus === 'pending_verification' || cleanStatus === '0') {
      return {
        label: t('common.pendingVerification') || 'قيد التثبت',
        color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30',
        dot: 'bg-orange-500 animate-pulse'
      };
    }
    if (cleanStatus === 'readonly' || cleanStatus === 'read_only' || cleanStatus === '3') {
      return {
        label: t('common.readOnly') || 'قراءة فقط',
        color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
        dot: 'bg-indigo-500'
      };
    }
    if (cleanStatus === 'suspended' || cleanStatus === '4') {
      return {
        label: t('common.suspended') || 'معلق',
        color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30 hover:bg-rose-100/50 dark:hover:bg-rose-950/50',
        dot: 'bg-rose-500'
      };
    }
    if (cleanStatus === 'rejected') {
      return {
        label: t('common.rejected') || 'مرفوض',
        color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
        dot: 'bg-rose-500'
      };
    }
    return {
      label: status || t('common.unknown'),
      color: 'bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800',
      dot: 'bg-gray-400'
    };
  };
};
