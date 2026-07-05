import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WelcomeHeader({ name, role, date }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-card p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-border-main gap-4 w-full" dir="rtl">
      <div className="flex items-center gap-3 sm:gap-4">
         <div className="avatar">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full ring ring-primary ring-offset-bg-card ring-offset-2">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=احمد" alt="user" />
            </div>
         </div>
         <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-main">{t('dashboard.welcomeWithName', { name })}</h2>
            <p className="text-xs sm:text-sm text-text-muted">{role}</p>
         </div>
      </div>
      <div className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm self-start sm:self-auto">{date}</div>
    </div>
  );
}
