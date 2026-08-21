import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchActiveSubscriptions, fetchPendingPaymentAccounts, activateSubscription, renewSubscription, updateAllSubscriptionAmounts } from '../services/subscriptionApi';
import { labsApi } from '../../labs/services/labsApi';
import { toast } from 'sonner';

const normalizePendingPaymentAccount = (acc, labsList = [], t) => {
  let matchedLab = null;

  if (labsList && labsList.length > 0) {
    matchedLab = labsList.find(l => 
      (acc.id && String(l.ownerId) === String(acc.id)) ||
      (acc.ownerId && String(l.ownerId) === String(acc.ownerId)) ||
      (acc.email && l.ownerEmail && l.ownerEmail.toLowerCase() === acc.email.toLowerCase()) ||
      (acc.email && l.email && l.email.toLowerCase() === acc.email.toLowerCase())
    );
  }

  const labId = matchedLab ? matchedLab.id : (acc.labId || acc.dentalLabId || (acc.ownerId && String(acc.id) !== String(acc.ownerId) ? acc.id : acc.labId || acc.id));
  const fallbackLabName = t ? t('subscription.subscriptionModal.labFallbackName', { id: labId }) : `مخبر #${labId}`;
  const labName = matchedLab?.labNamePlace || acc.labNamePlace || acc.namePlace || acc.labName || acc.name || fallbackLabName;
  const ownerName = matchedLab?.ownerName || acc.ownerName || acc.name;
  const email = matchedLab?.ownerEmail || acc.ownerEmail || acc.email;
  const phone = matchedLab?.ownerPhone || acc.ownerPhone || acc.phone;

  return {
    ...acc,
    labId: labId,
    labName: labName,
    ownerName: ownerName,
    email: email,
    phone: phone,
    addressPlace: matchedLab?.addressPlace || acc.addressPlace,
    cityPlace: matchedLab?.cityPlace || acc.cityPlace,
    countryPlace: matchedLab?.countryPlace || acc.countryPlace,
    status: acc.status,
    createdAt: acc.createdAt,
  };
};

export const useSubscriptions = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');
  const [activeSubs, setActiveSubs] = useState([]);
  const [pendingPaymentAccounts, setPendingPaymentAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedSub, setSelectedSub] = useState(null);

  const [amountModalOpen, setAmountModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [activeData, pendingPaymentData, labsData] = await Promise.all([
        fetchActiveSubscriptions().catch(() => []),
        fetchPendingPaymentAccounts().catch(() => []),
        labsApi.getLabs().catch(() => [])
      ]);

      const activeArray = Array.isArray(activeData) ? activeData : (activeData?.subscriptions || []);
      const pendingPaymentArray = Array.isArray(pendingPaymentData) ? pendingPaymentData : (pendingPaymentData?.accounts || pendingPaymentData?.data || []);
      const labsArray = Array.isArray(labsData) ? labsData : (labsData?.data || labsData || []);

      setActiveSubs(activeArray);
      setPendingPaymentAccounts(pendingPaymentArray.map(acc => normalizePendingPaymentAccount(acc, labsArray, t)));
    } catch (e) {
      console.error('Error loading subscriptions', e);
      toast.error(t('subscription.hooks.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAddModal = () => {
    setModalType('add');
    setSelectedSub(null);
    setModalOpen(true);
  };

  const handleOpenActivateModal = (sub) => {
    setModalType('activate');
    setSelectedSub(sub);
    setModalOpen(true);
  };

  const handleOpenRenewModal = (sub) => {
    setModalType('renew');
    setSelectedSub(sub);
    setModalOpen(true);
  };

  const handleOpenAmountModal = () => {
    setAmountModalOpen(true);
  };

  const handleUpdateAllAmounts = async (newAmount) => {
    try {
      const res = await updateAllSubscriptionAmounts(newAmount);
      toast.success(res?.message || t('subscription.hooks.updateAllSuccess'));
      load();
    } catch (e) {
      console.error(e);
      const errMsg = e?.response?.data?.message || t('subscription.hooks.updateAllError');
      toast.error(errMsg);
      throw e;
    }
  };

  const handleModalSubmit = async (labId, payload) => {
    try {
      if (modalType === 'renew') {
        await renewSubscription(labId, payload);
        toast.success(t('subscription.hooks.renewSuccess'));
      } else {
        await activateSubscription(labId, payload);
        toast.success(t('subscription.hooks.activateSuccess'));
      }
      load();
    } catch (e) {
      console.error(e);
      const errMsg = e?.response?.data?.message || t('subscription.hooks.saveError');
      toast.error(errMsg);
      throw e;
    }
  };

  // تصفية الاشتراكات الحالية حسب التبويب المختار وجملة البحث
  const rawList = activeTab === 'active' ? activeSubs : pendingPaymentAccounts;
  const filteredSubs = rawList.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = String(item.labName || '').toLowerCase().includes(q);
    const emailMatch = String(item.email || '').toLowerCase().includes(q);
    const idMatch = String(item.labId || '').includes(q);
    return nameMatch || emailMatch || idMatch;
  });

  return {
    subs: filteredSubs,
    activeCount: activeSubs.length,
    pendingPaymentCount: pendingPaymentAccounts.length,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    loading,
    modalOpen,
    setModalOpen,
    modalType,
    selectedSub,
    handleOpenAddModal,
    handleOpenActivateModal,
    handleOpenRenewModal,
    handleModalSubmit,
    refreshSubscriptions: load,

    amountModalOpen,
    setAmountModalOpen,
    handleOpenAmountModal,
    handleUpdateAllAmounts,
  };
};
