import React from 'react';
import { useTranslation } from 'react-i18next';

const InterventionLogPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('interventions.legacyPage.title')}</h1>
      <p>{t('interventions.legacyPage.placeholder')}</p>
    </div>
  );
};

export default InterventionLogPage;
