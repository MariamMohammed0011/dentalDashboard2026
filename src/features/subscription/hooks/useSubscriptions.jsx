import { useState, useEffect } from 'react';
import { fetchActiveSubscriptions, fetchExpiredSubscriptions, fetchPendingPaymentAccounts, activateSubscription, renewSubscription, updateAllSubscriptionAmounts } from '../services/subscriptionApi';
import { toast } from 'sonner';
const normalizePendingPaymentAccount = (acc) => ({
  labId: acc.id,
  labName: acc.namePlace || acc.name || `مخبر #${acc.id}`,
  ownerName: acc.name,
  email: acc.email,
  phone: acc.phone,
  addressPlace: acc.addressPlace,
  cityPlace: acc.cityPlace,
  countryPlace: acc.countryPlace,
  status: acc.status,
  createdAt: acc.createdAt,
});

export const useSubscriptions = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [activeSubs, setActiveSubs] = useState([]);
  const [expiredSubs, setExpiredSubs] = useState([]);
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
      const [activeData, expiredData, pendingPaymentData] = await Promise.all([
        fetchActiveSubscriptions().catch(() => []),
        fetchExpiredSubscriptions().catch(() => []),
        fetchPendingPaymentAccounts().catch(() => [])
      ]);

      const activeArray = Array.isArray(activeData) ? activeData : (activeData?.subscriptions || []);
      const expiredArray = Array.isArray(expiredData) ? expiredData : (expiredData?.subscriptions || []);
      const pendingPaymentArray = Array.isArray(pendingPaymentData) ? pendingPaymentData : (pendingPaymentData?.accounts || []);

      setActiveSubs(activeArray);
      setExpiredSubs(expiredArray);
      setPendingPaymentAccounts(pendingPaymentArray.map(normalizePendingPaymentAccount));
    } catch (e) {
      console.error('Error loading subscriptions', e);
      toast.error('حدث خطأ أثناء تحميل بيانات الاشتراكات');
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
      toast.success(res?.message || 'تم تحديث قيمة الاشتراك لجميع المخابر بنجاح');
      load();
    } catch (e) {
      console.error(e);
      const errMsg = e?.response?.data?.message || 'حدث خطأ أثناء تحديث قيمة الاشتراك';
      toast.error(errMsg);
      throw e;
    }
  };

  const handleModalSubmit = async (labId, payload) => {
    try {
      if (modalType === 'renew') {
        await renewSubscription(labId, payload);
        toast.success('تم تجديد الاشتراك وتحديث الحساب بنجاح');
      } else {
        await activateSubscription(labId, payload);
        toast.success('تم تسجيل الاشتراك وتفعيل حساب المخبر بنجاح');
      }
      load();
    } catch (e) {
      console.error(e);
      const errMsg = e?.response?.data?.message || 'حدث خطأ أثناء حفظ الاشتراك';
      toast.error(errMsg);
      throw e;
    }
  };

  // تصفية الاشتراكات الحالية حسب التبويب المختار وجملة البحث
  const rawList = activeTab === 'active' ? activeSubs : activeTab === 'expired' ? expiredSubs : pendingPaymentAccounts;
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
    expiredCount: expiredSubs.length,
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
