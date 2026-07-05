import { useTranslation } from 'react-i18next';

export const useLabAvailability = () => {
  const { t } = useTranslation();

  return (status) => {
    const cleanStatus = typeof status === 'string' ? status.toLowerCase() : status;
    if (cleanStatus === 'available' || cleanStatus === 0) {
      return {
        label: t('labs.detailsModal.availableForWork'),
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40',
        dot: 'bg-emerald-500'
      };
    }
    if (cleanStatus === 'busy' || cleanStatus === 1) {
      return {
        label: t('labs.detailsModal.busy'),
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40',
        dot: 'bg-amber-500'
      };
    }
    return {
      label: t('labs.detailsModal.notAvailable'),
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40',
      dot: 'bg-rose-500'
    };
  };
};
