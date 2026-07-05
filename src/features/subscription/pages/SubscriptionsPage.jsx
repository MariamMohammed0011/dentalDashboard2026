import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchActiveSubscriptions, activateSubscription, renewSubscription } from '../services/subscriptionApi';
import SubscriptionCard from '../components/SubscriptionCard';
import { Loader2 } from 'lucide-react';

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchActiveSubscriptions();
      // Ensure we always store an array for rendering
      const subsArray = Array.isArray(data) ? data : (data?.subscriptions ? data.subscriptions : []);
      setSubs(subsArray);
    } catch (e) {
      console.error('Error loading subscriptions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleActivate = async (labId) => {
    await activateSubscription(labId);
    load();
  };

  const handleRenew = async (labId) => {
    await renewSubscription(labId);
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-text-main">{t('subscription.headerTitle')}</h1>
      {subs.length === 0 ? (
        <p className="text-text-muted">{t('subscription.noActive')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subs.map((sub) => (
            <SubscriptionCard
              key={sub.labId}
              sub={sub}
              onActivate={handleActivate}
              onRenew={handleRenew}
            />
          ))}
        </div>
      )}
    </div>
  );
}
