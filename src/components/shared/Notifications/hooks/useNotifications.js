// src/hooks/useNotifications.js
import { useState, useRef, useEffect } from 'react';
import { notificationsService } from '../services/notificationsService';
import { signalRService } from '../services/signalRService';
import { toast } from 'sonner';

export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // إضافة حالة التحميل لكون البيانات تأتي من خدمة خارجيّة
  const timeoutRef = useRef(null);

  // جلب البيانات وإعداد اتصال SignalR عند التركيب
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsService.getNotifications();
        // مقارنة المعرفات لمنع تحديث الـ State في حال عدم وجود تغييرات حقيقية
        setNotifications((prev) => {
          const prevIds = prev.map((n) => n.id).join(",");
          const dataIds = data.map((n) => n.id).join(",");
          if (prevIds === dataIds) return prev;
          return data;
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // تشغيل تحديث دوري (Polling) كحل احتياطي كل 5 ثوانٍ لضمان جلب البيانات تلقائياً
    const pollingInterval = setInterval(fetchNotifications, 5000);

    // معالجة الإشعار اللحظي القادم من الويب سوكيت
    const handleIncomingNotification = (rawNotif) => {
      if (!rawNotif) return;
      
      const formatted = notificationsService.formatNotification(rawNotif);
      
      // تحديث مصفوفة الإشعارات بإضافة الإشعار الجديد في البداية
      setNotifications((prev) => {
        // تجنب تكرار الإشعار في حال استلامه بالخطأ مرتين
        if (prev.some((n) => n.id === formatted.id)) return prev;
        return [formatted, ...prev];
      });

      // إظهار تنبيه Toast فخم وجذاب للمستخدم
      toast.info("إشعار جديد", {
        description: formatted.text,
        duration: 6000,
        action: {
          label: "عرض الإشعار",
          onClick: () => {
            setIsOpen(true);
          }
        }
      });
    };

    // تشغيل الاتصال بالـ Hub
    signalRService.startConnection(handleIncomingNotification)
      .catch((err) => console.error("Error starting SignalR connection in hook:", err));

    // إغلاق الاتصال والتكرار عند إلغاء التركيب
    return () => {
      clearInterval(pollingInterval);
      signalRService.stopConnection();
    };
  }, []);

  // حساب عدد الإشعارات غير المقروءة ديناميكياً
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  // العمليات المعتمدة على الـ Service
  const markAllAsSeen = async () => {
    const updated = await notificationsService.markAllAsRead();
    setNotifications(updated);
  };

  const clearAll = async () => {
    const updated = await notificationsService.clearAllNotifications();
    setNotifications(updated);
  };

  const removeNotification = async (id) => {
    const updated = await notificationsService.deleteNotification(id);
    setNotifications(updated);
  };

  const toggleReadStatus = async (id) => {
    const updated = await notificationsService.markAsRead(id);
    setNotifications(updated);
  };

  return {
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    loading, // تم تمريرها للمكونات لتوضيح حالة التحميل إذا لزم الأمر
    handleMouseEnter,
    handleMouseLeave,
    markAllAsSeen,
    clearAll,
    removeNotification,
    toggleReadStatus
  };
}