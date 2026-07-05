import { useTranslation } from 'react-i18next';

export const useLabStatusConfig = () => {
  const { t } = useTranslation();

  return (status) => {
    const cleanStatus = typeof status === 'string' ? status.toLowerCase() : '';
    if (cleanStatus === 'active') {
      return {
        label: t('common.active'),
        color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
        dot: 'bg-emerald-500 animate-pulse'
      };
    }
    if (cleanStatus === 'pendingadminapproval' || cleanStatus === 'pending') {
      return {
        label: t('common.pending'),
        color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
        dot: 'bg-amber-500 animate-pulse'
      };
    }
    if (cleanStatus === 'suspended') {
      return {
        label: t('common.suspended'),
        color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30 hover:bg-rose-100/50 dark:hover:bg-rose-950/50',
        dot: 'bg-rose-500'
      };
    }
    if (cleanStatus === 'rejected') {
      return {
        label: t('common.rejected'),
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
