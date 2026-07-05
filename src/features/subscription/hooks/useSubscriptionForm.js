import { useState, useEffect } from 'react';
import { labsApi } from '../../labs/services/labsApi';

export const useSubscriptionForm = ({ isOpen, type, initialData, onSubmit, onClose }) => {
  const [labs, setLabs] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);

  const [selectedLabId, setSelectedLabId] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      // Set default dates
      const today = new Date().toISOString().split('T')[0];
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      const nextYear = nextYearDate.toISOString().split('T')[0];

      if (initialData) {
        setSelectedLabId(initialData.labId || '');
        setAmount('');
        setStartDate(today);
        setEndDate(nextYear);
      } else {
        setSelectedLabId('');
        setAmount('');
        setStartDate(today);
        setEndDate(nextYear);
      }

      // Fetch labs if type is "add" (meaning we need to select a lab)
      if (type === 'add') {
        const fetchLabs = async () => {
          setLoadingLabs(true);
          try {
            const data = await labsApi.getLabs();
            setLabs(data || []);
          } catch (e) {
            console.error('Failed to fetch labs', e);
          } finally {
            setLoadingLabs(false);
          }
        };
        fetchLabs();
      }
    }
  }, [isOpen, initialData, type]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!amount || !startDate || !endDate || (type === 'add' && !selectedLabId)) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        amount,
        periodStartUtc: startDate,
        periodEndUtc: endDate,
      };
      
      const labId = type === 'add' ? selectedLabId : initialData.labId;
      await onSubmit(labId, payload);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'حدث خطأ أثناء حفظ الاشتراك');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    labs,
    loadingLabs,
    selectedLabId,
    setSelectedLabId,
    amount,
    setAmount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSubmitting,
    error,
    setError,
    handleSubmit,
  };
};
