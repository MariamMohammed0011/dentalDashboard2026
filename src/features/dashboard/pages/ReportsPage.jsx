import React from 'react';
import { useTranslation } from 'react-i18next';

const ReportsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('reports.title')}</h1>
      <p>{t('reports.legacyPage.placeholder')}</p>
    </div>
  );
};

export default ReportsPage;
