import { useState, useRef, useEffect } from 'react';
import { notificationsService } from '../services/notificationsService';
import { signalRService } from '../services/signalRService';
import { toast } from 'sonner';

export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // 1. جلب الإشعارات المحفوظة قديماً في السيرفر لمرة واحدة فقط عند إقلاع المكون
   // داخل useNotifications
// داخل useNotifications
const fetchNotifications = async () => {
  try {
    const data = await notificationsService.getNotifications();
    console.log("البيانات الخام القادمة من السيرفر:", data); 
    
    if (isMounted) {
      // إذا كانت المصفوفة لا تزال فارغة، هنا سنعرف هل السبب من السيرفر أم من الـ filter
      setNotifications(data || []);
      console.log("تم تحديث الحالة بـ:", data);
    }
  } catch (error) {
    console.error("خطأ أثناء الجلب:", error);
  } finally {
    if (isMounted) setLoading(false);
  }
};
    fetchNotifications();

    // 2. معالجة الإشعار اللحظي القادم من الويب سوكيت فوراً دون إعادة طلب الـ API
    const handleIncomingNotification = (rawNotif) => {
      if (!rawNotif || !isMounted) return;
      
      // تنسيق الكائن القادم من الباك إند ليطابق بنية العرض بالفرونت إند
      const formatted = notificationsService.formatNotification(rawNotif);
      
      setNotifications((prev) => {
        // منع التكرار العشوائي لنفس الـ ID
        if (prev.some((n) => n.id === formatted.id)) return prev;
        return [formatted, ...prev];
      });

      // تنبيه منبثق للمخدم
      toast.info("إشعار جديد", {
        description: formatted.text,
        duration: 6000,
        action: {
          label: "عرض الإشعار",
          onClick: () => setIsOpen(true)
        }
      });
    };

    // 3. تشغيل الـ SignalR والاستماع للـ Hub بشكل آمن
    const startSignalR = async () => {
      try {
        await signalRService.startConnection(handleIncomingNotification);
      } catch (err) {
        console.error("Error starting SignalR connection in hook:", err);
      }
    };

    startSignalR();

    // تنظيف الـ Connection بشكل ذكي لا يقطع الاتصال المستقر أثناء الـ StrictMode المزدوج
    return () => {
      isMounted = false;
    };
  }, []);

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
    loading,
    handleMouseEnter,
    handleMouseLeave,
    markAllAsSeen,
    clearAll,
    removeNotification,
    toggleReadStatus
  };
}