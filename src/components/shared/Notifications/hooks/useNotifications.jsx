import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notificationsService';
import { signalRService } from '../services/signalRService';
import { toast } from 'sonner';

export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  // جلب الإشعارات باستخدام react-query لضمان التزامن الكامل عبر التطبيق
  const { data: notifications = [], isLoading: loading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.getNotifications(),
    refetchInterval: 10000, // تحديث دوري كل 10 ثوانٍ كخطة بديلة آمنة
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    let isMounted = true;

    // معالجة الإشعار اللحظي القادم من الويب سوكيت فوراً وتحديث الكاش الخاص بـ react-query
    const handleIncomingNotification = (rawNotif) => {
      if (!rawNotif || !isMounted) return;
      
      const formatted = notificationsService.formatNotification(rawNotif);
      
      // تحديث كاش الإشعار في القائمة المنسدلة
      queryClient.setQueryData(['notifications'], (prev = []) => {
        if (prev.some((n) => n.id === formatted.id)) return prev;
        return [formatted, ...prev];
      });

      // تحديث كاش الإشعار في صفحة الأرشيف إذا كانت مفتوحة
      queryClient.setQueryData(['notifications-list-data'], (prev = []) => {
        if (prev.some((n) => n.id === formatted.id)) return prev;
        return [formatted, ...prev];
      });

      // تنبيه منبثق للمستخدم
      toast.info("إشعار جديد", {
        description: formatted.text,
        duration: 6000,
        action: {
          label: "عرض الإشعار",
          onClick: () => setIsOpen(true)
        }
      });
    };

    const startSignalR = async () => {
      try {
        await signalRService.startConnection(handleIncomingNotification);
      } catch (err) {
        console.error("Error starting SignalR connection in hook:", err);
      }
    };

    startSignalR();

    return () => {
      isMounted = false;
    };
  }, [queryClient]);

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
    queryClient.setQueryData(['notifications'], updated);
    queryClient.setQueryData(['notifications-list-data'], updated);
  };

  const clearAll = async () => {
    const updated = await notificationsService.clearAllNotifications();
    queryClient.setQueryData(['notifications'], updated);
    queryClient.setQueryData(['notifications-list-data'], updated);
  };

  const removeNotification = async (id) => {
    const updated = await notificationsService.deleteNotification(id);
    queryClient.setQueryData(['notifications'], updated);
    queryClient.setQueryData(['notifications-list-data'], updated);
  };

  const toggleReadStatus = async (id) => {
    const updated = await notificationsService.markAsRead(id);
    queryClient.setQueryData(['notifications'], updated);
    queryClient.setQueryData(['notifications-list-data'], updated);
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