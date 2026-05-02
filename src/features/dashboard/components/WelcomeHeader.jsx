import React from 'react';

export default function WelcomeHeader({ name, role, date }) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm" dir="rtl">
      <div className="flex items-center gap-4">
         <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=احمد" alt="user" />
            </div>
         </div>
         <div>
            <h2 className="text-xl font-bold">أهلاً بك، {name}</h2>
            <p className="text-sm text-gray-400">{role}</p>
         </div>
      </div>
      <div className="badge badge-primary p-4 font-bold">{date}</div>
    </div>
  );
}
