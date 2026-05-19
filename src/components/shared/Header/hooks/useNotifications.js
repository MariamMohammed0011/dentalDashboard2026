import { useState, useRef } from 'react';

export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Mock Notifications Data
  const [notifications, setNotifications] = useState([
    { id: 1, type: "join", text: "طلب انضمام جديد من د. أحمد محمود في قائمة الأطباء", time: "منذ 5 دقائق", read: false },
    { id: 2, type: "message", text: "رسالة جديدة من د. سارة الأحمد بخصوص الطلبات المعلقة", time: "منذ 15 دقيقة", read: false },
    { id: 3, type: "update", text: "تم تحديث حالة الطلب #1024 بنجاح إلى 'جاهز للتسليم'", time: "منذ ساعتين", read: false },
    { id: 4, type: "reminder", text: "تذكير هام: موعد اجتماع الإدارة الأسبوعي غداً الساعة 10 صباحاً", time: "منذ 4 ساعات", read: true },
    { id: 5, type: "comment", text: "علق المشرف د. خالد على التقرير المالي لشهر أبريل: 'يرجى مراجعة الأرقام'", time: "منذ يوم واحد", read: true },
    { id: 6, type: "join", text: "طلب انتساب جديد من عيادة الأمل لطب الأسنان بجدة", time: "منذ يومين", read: true },
    { id: 7, type: "message", text: "استفسار جديد من المريض محمد علي حول خدمات التعويضات السنية", time: "منذ 3 أيام", read: true },
    { id: 8, type: "reminder", text: "تنبيه النظام: موعد تجديد ترخيص المنصة السنوي بعد 3 أيام", time: "منذ 4 أيام", read: false }
  ]);

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

  const markAllAsSeen = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return {
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    handleMouseEnter,
    handleMouseLeave,
    markAllAsSeen,
    clearAll,
    removeNotification,
    toggleReadStatus
  };
}