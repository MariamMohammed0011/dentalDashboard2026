import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8" dir="rtl">
      <h1 className="text-xl font-black text-gray-800">{t('header.systemName')}</h1>
      
      <div className="flex items-center gap-3">
        <div className="text-left hidden md:block">
          <p className="text-sm font-bold">{t('header.adminName')}</p>
          <p className="text-xs text-gray-400">{t('header.adminRole')}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white shadow-sm overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=May" alt="User Avatar" />
        </div>
      </div>
    </header>
  );
}
