import React from 'react';
import { CreditCard, RefreshCcw } from 'lucide-react';

export default function SubscriptionCard({ sub, onActivate, onRenew }) {
  const { labId, labName, email, subscriptionStartUtc, subscriptionEndUtc, remainingDays } = sub;
  const isActive = new Date(subscriptionEndUtc) > new Date();

  return (
    <div className="card-glass rounded-xl p-4 space-y-2 hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main">{labName}</h3>
        {isActive ? (
          <span className="text-success font-semibold">نشط</span>
        ) : (
          <button onClick={() => onActivate(labId)} className="flex items-center gap-1 text-primary hover:text-primary-dark">
            <CreditCard size={18} /> تفعيل
          </button>
        )}
      </div>
      <p className="text-sm text-text-muted">البريد: {email}</p>
      <p className="text-sm text-text-muted">
        من {new Date(subscriptionStartUtc).toLocaleDateString()} إلى {new Date(subscriptionEndUtc).toLocaleDateString()}
      </p>
      <p className="text-sm">{remainingDays} يومًا متبقيًا</p>
      {isActive && (
        <button onClick={() => onRenew(labId)} className="self-end flex items-center gap-1 text-primary hover:text-primary-dark">
          <RefreshCcw size={16} /> تجديد
        </button>
      )}
    </div>
  );
}
