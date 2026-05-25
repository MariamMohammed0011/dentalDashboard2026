// src/hooks/useNotifications.js
import { useState, useRef, useEffect } from 'react';
import { notificationsService } from '../services/notificationsService';

export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // إضافة حالة التحميل لكون البيانات تأتي من خدمة خارجيّة
  const timeoutRef = useRef(null);

  // جلب البيانات عند جلب الـ Hook للمرة الأولى
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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