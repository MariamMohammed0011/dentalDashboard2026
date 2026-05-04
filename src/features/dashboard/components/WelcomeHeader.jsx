import React from 'react';

export default function WelcomeHeader({ name, role, date }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-card p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-border-main gap-4" dir="rtl">
      <div className="flex items-center gap-4">
         <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-bg-card ring-offset-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=احمد" alt="user" />
            </div>
         </div>
         <div>
            <h2 className="text-lg md:text-xl font-bold text-text-main">أهلاً بك، {name}</h2>
            <p className="text-sm text-text-muted">{role}</p>
         </div>
      </div>
      <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm">{date}</div>
    </div>
  );
}
