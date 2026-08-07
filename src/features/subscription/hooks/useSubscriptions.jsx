import { useState, useEffect } from 'react';
import { fetchActiveSubscriptions, fetchExpiredSubscriptions, activateSubscription, renewSubscription } from '../services/subscriptionApi';
import { toast } from 'sonner';

export const useSubscriptions = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'expired'
  const [activeSubs, setActiveSubs] = useState([]);
  const [expiredSubs, setExpiredSubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'activate' | 'renew'
  const [selectedSub, setSelectedSub] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [activeData, expiredData] = await Promise.all([
        fetchActiveSubscriptions().catch(() => []),
        fetchExpiredSubscriptions().catch(() => [])
      ]);

      const activeArray = Array.isArray(activeData) ? activeData : (activeData?.subscriptions || []);
      const expiredArray = Array.isArray(expiredData) ? expiredData : (expiredData?.subscriptions || []);

      setActiveSubs(activeArray);
      setExpiredSubs(expiredArray);
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
  const rawList = activeTab === 'active' ? activeSubs : expiredSubs;
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
    refreshSubscriptions: load
  };
};
