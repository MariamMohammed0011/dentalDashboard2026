import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import CustomSelect from '../../../components/ui/CustomSelect';
import { adsApi } from '../services/adsApi';

/**
 * قائمة اختيار الجمهور المستهدف بخيارات مجلوبة من الباك إند
 * وبنفس ستايل القوائم المنسدلة المعتمد في المشروع (CustomSelect)
 */
const TargetAudienceSelect = ({ value, onChange, enabled = true, className = '' }) => {
  const { t } = useTranslation();

  const { data: apiAudiences = [] } = useQuery({
    queryKey: ['ad-target-audiences'],
    queryFn: () => adsApi.getTargetAudiences(),
    enabled,
    staleTime: 1000 * 60 * 30,
  });

  // خيارات احتياطية تظهر ريثما تصل بيانات الباك إند أو في حال تعذر الجلب
  const fallbackOptions = [
    { value: 'dentists', label: t('ads.addAdForUserModal.audienceDentists') },
    { value: 'labs', label: t('ads.addAdForUserModal.audienceLabs') },
    { value: 'both', label: t('ads.addAdForUserModal.audienceBoth') },
  ];

  const options = apiAudiences.length > 0
    ? apiAudiences.map((audience) => ({
        value: String(audience.name || '').toLowerCase(),
        label: audience.displayName || audience.name,
      }))
    : fallbackOptions;

  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={options}
      className={className}
    />
  );
};

export default TargetAudienceSelect;
