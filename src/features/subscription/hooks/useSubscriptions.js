import { useState, useEffect } from 'react';
import { fetchActiveSubscriptions, activateSubscription, renewSubscription } from '../services/subscriptionApi';
import { toast } from 'sonner';

export const useSubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'activate' | 'renew'
  const [selectedSub, setSelectedSub] = useState(null);

  const load = async () => {
    try {
      const data = await fetchActiveSubscriptions();
      const subsArray = Array.isArray(data) ? data : (data?.subscriptions ? data.subscriptions : []);
      setSubs(subsArray);
    } catch (e) {
      console.error('Error loading subscriptions', e);
      toast.error('فشل في تحميل الاشتراكات');
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
        toast.success('تم تجديد الاشتراك وشحن الحساب بنجاح');
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

  return {
    subs,
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
