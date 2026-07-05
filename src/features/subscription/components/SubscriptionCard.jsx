import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, RefreshCcw } from 'lucide-react';

export default function SubscriptionCard({ sub, onActivate, onRenew }) {
  const { t } = useTranslation();
  const { labId, labName, email, subscriptionStartUtc, subscriptionEndUtc, remainingDays } = sub;
  const isActive = new Date(subscriptionEndUtc) > new Date();

  return (
    <div className="card-glass rounded-xl p-4 space-y-2 hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main">{labName}</h3>
        {isActive ? (
          <span className="text-success font-semibold">{t('subscription.active')}</span>
        ) : (
          <button onClick={() => onActivate(labId)} className="flex items-center gap-1 text-primary hover:text-primary-dark">
            <CreditCard size={18} /> {t('subscription.activate')}
          </button>
        )}
      </div>
      <p className="text-sm text-text-muted">{t('subscription.email')}: {email}</p>
      <p className="text-sm text-text-muted">
        {t('subscription.dateRange', { start: new Date(subscriptionStartUtc).toLocaleDateString(), end: new Date(subscriptionEndUtc).toLocaleDateString() })}
      </p>
      <p className="text-sm">{remainingDays} {t('subscription.remainingDays')}</p>
      {isActive && (
        <button onClick={() => onRenew(labId)} className="self-end flex items-center gap-1 text-primary hover:text-primary-dark">
          <RefreshCcw size={16} /> {t('subscription.renew')}
        </button>
      )}
    </div>
  );
}
