import React from 'react';

export default function WelcomeHeader({ name, role, date }) {
  return (
    <div className="flex justify-between items-center bg-bg-card p-6 rounded-[2rem] shadow-sm border border-border-main" dir="rtl">
      <div className="flex items-center gap-4">
         <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-bg-card ring-offset-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=احمد" alt="user" />
            </div>
         </div>
         <div>
            <h2 className="text-xl font-bold text-text-main">أهلاً بك، {name}</h2>
            <p className="text-sm text-text-muted">{role}</p>
         </div>
      </div>
      <div className="badge badge-primary p-4 font-bold">{date}</div>
    </div>
  );
}
