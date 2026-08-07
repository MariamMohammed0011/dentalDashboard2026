import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Bell, Send, Info, Coins,
  ArrowLeft, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

import { doctorsApi } from '../../doctors/services/doctorsApi';
import { labsApi } from '../../labs/services/labsApi';
import { adsApi } from '../../ads/services/adsApi';
import { usersApi } from '../../ads/services/usersApi';
import { notificationsService } from '../services/notificationsService';

const SendNotificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form State
  const [type, setType] = useState('reminder'); // ad, reminder, update, message
  const [recipientType, setRecipientType] = useState('all'); // all, doctors, labs, doctor, lab, ad_client
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [selectedAdId, setSelectedAdId] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Recipient Lists
  const { data: doctorsData, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['dentists-list-for-notif'],
    queryFn: () => doctorsApi.getDoctors(),
    enabled: recipientType === 'doctor',
  });
  const doctors = doctorsData?.doctors || [];

  const { data: labs = [], isLoading: isLoadingLabs } = useQuery({
    queryKey: ['labs-list-for-notif'],
    queryFn: () => labsApi.getLabs(),
    enabled: recipientType === 'lab',
  });

  const { data: adClients = [], isLoading: isLoadingAdClients } = useQuery({
    queryKey: ['ad-clients-for-notif'],
    queryFn: () => usersApi.getUsers(),
    enabled: recipientType === 'ad_client',
  });

  // 2. Fetch Pending Ads (for ad price notification type)
  const { data: adsData, isLoading: isLoadingAds } = useQuery({
    queryKey: ['pending-ads-for-notif'],
    queryFn: () => adsApi.getAds({ page: 1, limit: 100, filters: { approvalStatus: 'pending' } }),
    enabled: type === 'ad',
  });
  const pendingAds = adsData?.data || [];

  // Handle type change
  useEffect(() => {
    if (type === 'ad') {
      setTitle('تحديد سعر الإعلان والدفع');
      setRecipientType('ad_client');
    } else {
      setPrice('');
      setSelectedAdId('');
      setTitle('');
      setMessage('');
    }
  }, [type]);

  // Handle selected Ad change
  useEffect(() => {
    if (type === 'ad' && selectedAdId) {
      const selectedAd = pendingAds.find(ad => String(ad.id) === String(selectedAdId));
      if (selectedAd) {
        setSelectedRecipientId(selectedAd.userId);
        setTitle(`سعر إعلان المنصة: "${selectedAd.title}"`);
        setMessage(`تمت الموافقة المبدئية على إعلانك "${selectedAd.title}". يرجى دفع الرسوم المقترحة لتفعيل الإعلان ونشره على التطبيق.`);
      }
    }
  }, [selectedAdId, type, pendingAds]);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error(t('auth.fillAllFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === 'ad') {
        if (!selectedAdId) {
          toast.error('يرجى اختيار الإعلان المرتبط');
          setIsSubmitting(false);
          return;
        }
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          toast.error('يرجى إدخال سعر صحيح أكبر من الصفر');
          setIsSubmitting(false);
          return;
        }

        const selectedAd = pendingAds.find(ad => String(ad.id) === String(selectedAdId));
        const userId = selectedAd?.userId || selectedRecipientId || 2;

        await adsApi.approveAd(userId, selectedAdId, parsedPrice);

        await notificationsService.createNotification({
          text: `تم تحديد سعر الإعلان "${selectedAd?.title || 'إعلان'}" بقيمة ${parsedPrice.toLocaleString()} ل.س وإرسال إشعار دفع للمعلن.`,
          type: 'ad'
        });

        toast.success(t('notifications.sendSuccess'));
      } else {
        let recipientLabel = t('notifications.allUsers');
        if (recipientType === 'doctors') recipientLabel = t('notifications.allDoctors');
        if (recipientType === 'labs') recipientLabel = t('notifications.allLabs');
        if (recipientType === 'doctor') {
          const doc = doctors.find(d => String(d.id) === String(selectedRecipientId));
          recipientLabel = doc ? `الطبيب: ${doc.name}` : t('doctors.doctor');
        }
        if (recipientType === 'lab') {
          const lab = labs.find(l => String(l.id) === String(selectedRecipientId));
          recipientLabel = lab ? `المخبر: ${lab.name}` : t('labs.title');
        }

        await notificationsService.createNotification({
          text: `[${recipientLabel}] - ${title}: ${message}`,
          type: type
        });

        toast.success(t('notifications.sendSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      setPrice('');
      setSelectedAdId('');
      setSelectedRecipientId('');
      setTitle('');
      setMessage('');

      navigate('/dashboard/notifications');
    } catch (error) {
      console.error(error);
      toast.error(t('common.errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand-blue-light text-brand-blue rounded-2xl shadow-sm border border-brand-blue-border/50 flex items-center justify-center">
            <Bell size={28} className="text-brand-blue" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">{t('notifications.headerTitle')}</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">{t('notifications.subtitle')}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-2xl flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          {t('notifications.notificationArchive')}
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm w-full max-w-4xl mx-auto mt-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 text-right">
                <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">{t('notifications.recipientType')}</label>
                <select
                  value={recipientType}
                  onChange={(e) => {
                    setRecipientType(e.target.value);
                    setSelectedRecipientId('');
                  }}
                  className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-brand-blue transition-colors w-full cursor-pointer"
                >
                  <option value="all">{t('notifications.allUsers')}</option>
                  <option value="doctors">{t('notifications.allDoctors')}</option>
                  <option value="labs">{t('notifications.allLabs')}</option>
                  <option value="doctor">{t('doctors.doctor')}</option>
                  <option value="lab">{t('labs.title')}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 text-right">
                <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">{t('notifications.titleLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('notifications.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-brand-blue transition-colors w-full text-right"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-right h-full">
                <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">{t('notifications.message')}</label>
                <textarea
                  required
                  rows={5}
                  placeholder={t('notifications.messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-brand-blue transition-colors w-full text-right resize-none flex-grow"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 bg-brand-blue text-white hover:bg-brand-blue-hover font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('notifications.sending')}
                </>
              ) : (
                <>
                  <Send size={16} />
                  {t('notifications.sendButton')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationPage;
