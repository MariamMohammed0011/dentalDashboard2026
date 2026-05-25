// src/services/notificationsService.js

// البيانات التجريبية (Mock Data) محاطة محلياً داخل الملف
let mockNotifications = [
  { id: 1, type: "join", text: "طلب انضمام جديد من د. أحمد محمود في قائمة الأطباء", time: "منذ 5 دقائق", read: false },
  { id: 2, type: "message", text: "رسالة جديدة من د. سارة الأحمد بخصوص الطلبات المعلقة", time: "منذ 15 دقيقة", read: false },
  { id: 3, type: "update", text: "تم تحديث حالة الطلب #1024 بنجاح إلى 'جاهز للتسليم'", time: "منذ ساعتين", read: false },
  { id: 4, type: "reminder", text: "تذكير هام: موعد اجتماع الإدارة الأسبوعي غداً الساعة 10 صباحاً", time: "منذ 4 ساعات", read: true },
  { id: 5, type: "comment", text: "علق المشرف د. خالد على التقرير المالي لشهر أبريل: 'يرجى مراجعة الأرقام'", time: "منذ يوم واحد", read: true },
  { id: 6, type: "join", text: "طلب انتساب جديد من عيادة الأمل لطب الأسنان بجدة", time: "منذ يومين", read: true },
  { id: 7, type: "message", text: "استفسار جديد من المريض محمد علي حول خدمات التعويضات السنية", time: "منذ 3 أيام", read: true },
  { id: 8, type: "reminder", text: "تنبيه النظام: موعد تجديد ترخيص المنصة السنوي بعد 3 أيام", time: "منذ 4 أيام", read: false }
];

export const notificationsService = {
  // جلب كل الإشعارات
  getNotifications: async () => {
    // محاكاة تأخير الشبكة (اختياري، يمكنك حذفه لو أردت الاستجابة فورية)
    await new Promise(resolve => setTimeout(resolve, 100)); 
    return [...mockNotifications];
  },

  // تحديث حالة إشعار معين ليصبح مقروءاً
  markAsRead: async (id) => {
    mockNotifications = mockNotifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    return [...mockNotifications];
  },

  // قراءة جميع الإشعارات
  markAllAsRead: async () => {
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
    return [...mockNotifications];
  },

  // حذف إشعار معين
  deleteNotification: async (id) => {
    mockNotifications = mockNotifications.filter(n => n.id !== id);
    return [...mockNotifications];
  },

  // مسح جميع الإشعارات
  clearAllNotifications: async () => {
    mockNotifications = [];
    return [...mockNotifications];
  }
};