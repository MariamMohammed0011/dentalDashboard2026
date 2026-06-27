import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bell, Send, Users, Megaphone, Info, Coins, 
  ArrowLeft, Check, UserCheck, ShieldAlert, FileText, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

import { doctorsApi } from '../../doctors/services/doctorsApi';
import { labsApi } from '../../labs/services/labsApi';
import { adsApi } from '../../ads/services/adsApi';
import { usersApi } from '../../ads/services/usersApi';
import { notificationsService } from '../../../components/shared/Notifications/services/notificationsService';

const SendNotificationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('send'); // send or list

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
      setRecipientType('ad_client'); // Default recipient for ad prices
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
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === 'ad') {
        // Validation for Ad Price type
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

        // Call the approve ad API (sets price and notifies user)
        await adsApi.approveAd(userId, selectedAdId, parsedPrice);

        // Also add a custom record notification
        await notificationsService.createNotification({
          text: `تم تحديد سعر الإعلان "${selectedAd?.title || 'إعلان'}" بقيمة ${parsedPrice.toLocaleString()} ل.س وإرسال إشعار دفع للمعلن.`,
          type: 'ad'
        });

        toast.success('تم تحديد سعر الحملة وإرسال إشعار الدفع بنجاح');
      } else {
        // Send a general notification
        let recipientLabel = 'الجميع';
        if (recipientType === 'doctors') recipientLabel = 'جميع الأطباء';
        if (recipientType === 'labs') recipientLabel = 'جميع المخابر';
        if (recipientType === 'doctor') {
          const doc = doctors.find(d => String(d.id) === String(selectedRecipientId));
          recipientLabel = doc ? `الطبيب: ${doc.name}` : 'طبيب محدد';
        }
        if (recipientType === 'lab') {
          const lab = labs.find(l => String(l.id) === String(selectedRecipientId));
          recipientLabel = lab ? `المخبر: ${lab.name}` : 'مخبر محدد';
        }
        if (recipientType === 'ad_client') {
          const client = adClients.find(c => String(c.id) === String(selectedRecipientId));
          recipientLabel = client ? `العميل: ${client.name}` : 'عميل محدد';
        }

        await notificationsService.createNotification({
          text: `[${recipientLabel}] - ${title}: ${message}`,
          type: type
        });

        toast.success('تم إرسال الإشعار بنجاح');
      }

      // Invalidate queries so header updates count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // Reset form
      setPrice('');
      setSelectedAdId('');
      setSelectedRecipientId('');
      setTitle('');
      setMessage('');
      
      // Redirect to list
      navigate('/dashboard/notifications');
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء إرسال الإشعار');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#E8F1FF] text-[#367AFF] rounded-2xl shadow-sm border border-[#D2E4FF]/50 flex items-center justify-center">
            <Bell size={28} className="text-[#367AFF]" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">إدارة الإشعارات</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">إنشاء وإرسال التنبيهات المباشرة وإشعارات أسعار الإعلانات للمستخدمين</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-2xl flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          أرشيف الإشعارات
        </button>
      </div>

      {/* 2. Sub-Tabs switcher inside page */}
      <div className="flex border-b border-gray-200 dark:border-slate-800/80 -mb-2 mt-2 gap-6">
        <button
          onClick={() => setActiveTab('send')}
          className="pb-3 text-sm font-black border-b-2 border-[#367AFF] text-[#367AFF] transition-all relative px-1 cursor-pointer"
        >
          إرسال إشعار جديد
        </button>
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="pb-3 text-sm font-bold border-b-2 border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-250 transition-all px-1 cursor-pointer"
        >
          كل الإشعارات (الأرشيف)
        </button>
      </div>

      {/* 3. Form Card container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm w-full max-w-4xl mx-auto mt-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Right Column: General Settings */}
            <div className="flex flex-col gap-5">
              
              {/* Notification Type */}
              <div className="flex flex-col gap-1.5 text-right">
                <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">نوع الإشعار</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                >
                  <option value="reminder">تنبيه هام / تذكير</option>
                  <option value="ad">إشعار سعر الإعلان (للموافقة والدفع)</option>
                  <option value="update">تحديث حالة (تحديث في النظام)</option>
                  <option value="message">رسالة نظام عامة</option>
                </select>
              </div>

              {/* Recipient Category Selection (only shown for non-ad types, ad type forces specific client) */}
              {type !== 'ad' ? (
                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">فئة المستلمين</label>
                  <select
                    value={recipientType}
                    onChange={(e) => {
                      setRecipientType(e.target.value);
                      setSelectedRecipientId('');
                    }}
                    className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                  >
                    <option value="all">الجميع (أطباء ومخابر)</option>
                    <option value="doctors">جميع الأطباء</option>
                    <option value="labs">جميع المخابر</option>
                    <option value="doctor">طبيب محدد</option>
                    <option value="lab">مخبر محدد</option>
                    <option value="ad_client">عميل إعلانات محدد</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">فئة المستلم (تلقائي)</label>
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl">
                    عميل إعلانات (مرتبط بصاحب الإعلان)
                  </div>
                </div>
              )}

              {/* Specific Recipient Select - Doctor */}
              {recipientType === 'doctor' && type !== 'ad' && (
                <div className="flex flex-col gap-1.5 text-right animate-fade-in">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">اختر الطبيب المستلم</label>
                  {isLoadingDoctors ? (
                    <div className="flex items-center gap-2 text-gray-400 text-xs py-2"><Loader2 size={14} className="animate-spin text-[#367AFF]" /> جاري تحميل الأطباء...</div>
                  ) : (
                    <select
                      value={selectedRecipientId}
                      required
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                    >
                      <option value="">-- اختر طبيباً --</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} (ID: #{doc.id} - {doc.clinicName})</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Specific Recipient Select - Lab */}
              {recipientType === 'lab' && type !== 'ad' && (
                <div className="flex flex-col gap-1.5 text-right animate-fade-in">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">اختر المخبر المستلم</label>
                  {isLoadingLabs ? (
                    <div className="flex items-center gap-2 text-gray-400 text-xs py-2"><Loader2 size={14} className="animate-spin text-[#367AFF]" /> جاري تحميل المخابر...</div>
                  ) : (
                    <select
                      value={selectedRecipientId}
                      required
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                    >
                      <option value="">-- اختر مخبراً --</option>
                      {labs.map(lab => (
                        <option key={lab.id} value={lab.id}>{lab.name} (ID: #{lab.id})</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Specific Recipient Select - Ad Client */}
              {recipientType === 'ad_client' && type !== 'ad' && (
                <div className="flex flex-col gap-1.5 text-right animate-fade-in">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">اختر عميل الإعلانات</label>
                  {isLoadingAdClients ? (
                    <div className="flex items-center gap-2 text-gray-400 text-xs py-2"><Loader2 size={14} className="animate-spin text-[#367AFF]" /> جاري تحميل العملاء...</div>
                  ) : (
                    <select
                      value={selectedRecipientId}
                      required
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                    >
                      <option value="">-- اختر عميلاً --</option>
                      {adClients.map(client => (
                        <option key={client.id} value={client.id}>{client.name} (ID: #{client.id} - {client.phone})</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Ad Price related inputs (Associated Ad Selection) */}
              {type === 'ad' && (
                <div className="flex flex-col gap-1.5 text-right animate-fade-in">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">اختر الإعلان المعلق المرتبط</label>
                  {isLoadingAds ? (
                    <div className="flex items-center gap-2 text-gray-400 text-xs py-2"><Loader2 size={14} className="animate-spin text-[#367AFF]" /> جاري تحميل الإعلانات المعلقة...</div>
                  ) : pendingAds.length === 0 ? (
                    <div className="text-red-500 text-xs font-bold py-2 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 px-4 rounded-xl">لا توجد إعلانات معلقة حالياً تحتاج لتحديد السعر.</div>
                  ) : (
                    <select
                      value={selectedAdId}
                      required
                      onChange={(e) => setSelectedAdId(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                    >
                      <option value="">-- اختر إعلاناً معلقاً --</option>
                      {pendingAds.map(ad => (
                        <option key={ad.id} value={ad.id}>{ad.title} (المعلن: {ad.storeName} - ID: #{ad.id})</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Ad Price input */}
              {type === 'ad' && (
                <div className="flex flex-col gap-1.5 text-right animate-fade-in">
                  <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1 flex items-center gap-1.5">
                    <Coins size={14} className="text-[#367AFF]" />
                    سعر الحملة المقترح (ل.س)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="أدخل السعر بالليرة السورية"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl pl-16 pr-4 py-3 text-gray-700 dark:text-gray-250 font-extrabold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-left"
                      dir="ltr"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                      ل.س
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Left Column: Title and Message Fields */}
            <div className="flex flex-col gap-5">
              
              {/* Notification Title */}
              <div className="flex flex-col gap-1.5 text-right">
                <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">عنوان الإشعار</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل عنواناً واضحاً ومختصراً للإشعار"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right"
                />
              </div>

              {/* Notification Message */}
              <div className="flex flex-col gap-1.5 text-right h-full">
                <label className="text-gray-600 dark:text-gray-300 font-bold text-xs sm:text-sm mr-1">مضمون الإشعار</label>
                <textarea
                  required
                  rows={6}
                  placeholder="اكتب مضمون وتفاصيل الرسالة التي ستصل للمستخدم..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-250 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right resize-none flex-grow"
                />
              </div>

            </div>

          </div>

          {/* Alert Tip Box */}
          <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20 p-4 rounded-2xl flex items-start gap-3 text-right mt-2">
            <Info size={18} className="text-[#367AFF] mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-400 font-medium space-y-1">
              {type === 'ad' ? (
                <p>
                  <strong>إشعار سعر الإعلان:</strong> عند تأكيد الإرسال، سيتم تغيير حالة الإعلان المعلق إلى <strong>مقبول مبدئياً</strong> وتثبيت السعر المدخل، كما سيتم بث إشعار دفع فوري لحساب المعلن لتسديد الرسوم وتفعيل الإعلان.
                </p>
              ) : (
                <p>
                  <strong>إشعار مباشر:</strong> سيتم إرسال تنبيه فوري يظهر على أجهزة الفئة المستهدفة عبر إشعارات الويب وتطبيق الهاتف الذكي فوراً.
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => {
                setPrice('');
                setSelectedAdId('');
                setSelectedRecipientId('');
                setTitle('');
                setMessage('');
              }}
              className="py-3 px-6 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
            >
              إعادة تعيين النموذج
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send size={16} />
                  إرسال الإشعار
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
