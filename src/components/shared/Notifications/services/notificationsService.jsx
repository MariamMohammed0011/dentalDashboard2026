import axiosInstance from "../../../../api/axios";

// مفاتيح التخزين المحلي لتتبع الإشعارات المقروءة والمحذوفة في حال عدم وجود روابط مخصصة بالباك إند
const READ_NOTIFS_KEY = "read_notification_ids";
const DELETED_NOTIFS_KEY = "deleted_notification_ids";

const getLocalReadIds = () => {
  try {
    return JSON.parse(localStorage.getItem(READ_NOTIFS_KEY)) || [];
  } catch {
    return [];
  }
};

const getLocalDeletedIds = () => {
  try {
    return JSON.parse(localStorage.getItem(DELETED_NOTIFS_KEY)) || [];
  } catch {
    return [];
  }
};

const addLocalReadId = (id) => {
  const ids = getLocalReadIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(ids));
  }
};

const addLocalDeletedId = (id) => {
  const ids = getLocalDeletedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(DELETED_NOTIFS_KEY, JSON.stringify(ids));
  }
};

// 🎯 تعديل: استقبال الحقل المرجعي blogPostType القادم من الباك إند
// 🎯 تعديل: استقبال الحقل المرجعي blogPostType القادم من الباك إند وتخصيص نوع للمدونات وطلبات الموافقة
const mapNotificationType = (type, blogPostType, message) => {
  // فحص الحقلين لضمان التقاط النوع أياً كان مسماه من السيرفر
  const currentType = blogPostType || type || "";
  const lowerType = currentType.toLowerCase();
  const lowerMessage = message ? message.toLowerCase() : "";
  
  // مطابقة المدونات أو طلبات موافقة المدونة أولاً لتأخذ الأولوية
  if (
    lowerType.includes("blog") || 
    lowerType.includes("post") || 
    lowerMessage.includes("طلب موافقة") ||
    lowerMessage.includes("موافقة")
  ) {
    return "blog";
  }

  if (
    lowerType.includes("ad") || 
    lowerType.includes("advertisement") || 
    lowerMessage.includes("إعلان") || 
    lowerMessage.includes("اعلان")
  ) {
    return "ad";
  }

  if (lowerType.includes("status") || lowerType.includes("update")) {
    return "update";
  }

  // مطابقة الأنواع الخاصة بطلبات الموافقة أو حقول السيرفر (مثل CommunityDiscussionDoctor)
  if (
    lowerType.includes("join") || 
    lowerType.includes("membership") || 
    lowerType.includes("community") || 
    lowerType.includes("discussion") || 
    lowerMessage.includes("انضمام")
  ) {
    return "join";
  }
  if (lowerType.includes("message") || lowerType.includes("chat")) {
    return "message";
  }
  if (lowerType.includes("comment") || lowerType.includes("reply")) {
    return "comment";
  }
  return "reminder";
};

// دالة تنسيق الوقت بشكل نسبي فخم باللغة العربية مع معالجة فرق التوقيت
const formatTimeArabic = (dateString) => {
  if (!dateString) return "";
  try {
    let s = dateString.trim().replace(" ", "T");
    
    // فحص ما إذا كان النص يحتوي على منطقة زمنية بالفعل (Z أو +00:00)
    const hasTimezone = s.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(s);
    if (!hasTimezone) {
      // إلحاق Z ليعامل كـ UTC افتراضياً إذا لم يتم تحديد توقيت
      s += "Z";
    }

    let date = new Date(s);
    let now = new Date();

    if (isNaN(date.getTime())) {
      date = new Date(dateString);
    }

    let diffMs = now - date;

    // إذا كانت النتيجة سالبة (المستقبل) بسبب فرق المنطقة الزمنية بين المخدم والعميل
    // نقوم بتجربة قراءتها كزمن محلي للعميل (بدون Z) لتصحيح الفرق
    if (diffMs < 0) {
      const localDate = new Date(dateString.trim().replace(" ", "T"));
      const localDiff = now - localDate;
      if (localDiff >= 0) {
        date = localDate;
        diffMs = localDiff;
      }
    }

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) {
      if (diffMins === 1) return "منذ دقيقة";
      if (diffMins === 2) return "منذ دقيقتين";
      if (diffMins >= 3 && diffMins <= 10) return `منذ ${diffMins} دقائق`;
      return `منذ ${diffMins} دقيقة`;
    }
    if (diffHours < 24) {
      if (diffHours === 1) return "منذ ساعة";
      if (diffHours === 2) return "منذ ساعتين";
      if (diffHours >= 3 && diffHours <= 10) return `منذ ${diffHours} ساعات`;
      return `منذ ${diffHours} ساعة`;
    }
    if (diffDays < 7) {
      if (diffDays === 1) return "منذ يوم";
      if (diffDays === 2) return "منذ يومين";
      if (diffDays >= 3 && diffDays <= 10) return `منذ ${diffDays} أيام`;
      return `منذ ${diffDays} يوم`;
    }
    
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const notificationsService = {
  // دالة تنسيق وتوحيد شكل الإشعار
  formatNotification: (n) => {
    const localReadIds = getLocalReadIds();
    
    let adObj = n.advertisement || null;
    let text = n.message || "";

    // محاولة فك رسالة JSON (خاصة بإشعارات الإعلانات حيث تكون الرسالة كاملة بصيغة JSON)
    if (!adObj && typeof n.message === 'string') {
      try {
        const parsed = JSON.parse(n.message);
        if (parsed && parsed.advertisement) {
          adObj = parsed.advertisement;
          text = parsed.message || text;
        }
      } catch (e) {
        // ليست JSON، نستخدم الرسالة كما هي
      }
    }

    const rawId = n.id || Math.floor(Math.random() * 1000000);

    if (adObj && adObj.title) {
      text = `طلب إعلان جديد: "${adObj.title}"`;
    }

    const type = mapNotificationType(n.type || (adObj ? "ad" : ""), n.blogPostType, text);

    return {
      id: rawId,
      type: type,
      text: text,
      time: formatTimeArabic(n.createdAt),
      read: n.isRead || localReadIds.includes(rawId),
      createdAt: n.createdAt
    };
  },

  // جلب كل الإشعارات
 // في ملف notificationsService.js
// داخل ملف notificationsService.js، عدلي دالة الجلب لتصبح كالتالي:
getNotifications: async () => {
    try {
        const response = await axiosInstance.get('/DoctorBlog/notifications'); 
        console.log("البيانات الخام من الـ API:", response.data); 
        
        const apiNotifs = response.data.map(n => notificationsService.formatNotification(n));
        
        // جلب الإشعارات المحلية المضافة عبر نموذج الإرسال
        const localNotifsRaw = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
        const deletedIds = getLocalDeletedIds();
        const localNotifs = localNotifsRaw
          .filter(n => !deletedIds.includes(n.id))
          .map(n => notificationsService.formatNotification(n));
          
        return [...localNotifs, ...apiNotifs];
    } catch (error) {
        console.error("خطأ في الخدمة:", error);
        const localNotifsRaw = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
        const deletedIds = getLocalDeletedIds();
        const localNotifs = localNotifsRaw
          .filter(n => !deletedIds.includes(n.id))
          .map(n => notificationsService.formatNotification(n));
        return localNotifs;
    }
  },

  // إنشاء إشعار جديد
  createNotification: async (notificationData) => {
    const rawId = Math.floor(Math.random() * 1000000);
    const newNotif = {
      id: rawId,
      message: notificationData.message || notificationData.text,
      type: notificationData.type || "reminder",
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // محاولة إرسال الإشعار للباك إند
    try {
      await axiosInstance.post('/DoctorBlog/notifications', {
        message: newNotif.message,
        type: newNotif.type
      });
    } catch (error) {
      console.warn("فشل الإرسال للسيرفر، سيتم حفظ الإشعار محلياً:", error);
    }

    // حفظ محلي لضمان ظهوره فوراً في الجدول وجرس الإشعارات
    const localNotifs = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
    localNotifs.unshift(newNotif);
    localStorage.setItem("mock_notifications", JSON.stringify(localNotifs));

    return newNotif;
  },

  // تحديث حالة إشعار معين ليصبح مقروءاً
  markAsRead: async (id) => {
    addLocalReadId(id);
    try {
      const localNotifs = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
      const updated = localNotifs.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem("mock_notifications", JSON.stringify(updated));
    } catch (e) {}
    
    try {
      await axiosInstance.put(`/DoctorBlog/notifications/${id}/read`);
    } catch (error) {
      // تجاهل الخطأ
    }
    return await notificationsService.getNotifications();
  },

  // قراءة جميع الإشعارات
  markAllAsRead: async () => {
    try {
      const localNotifs = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
      const updated = localNotifs.map(n => ({ ...n, isRead: true }));
      localStorage.setItem("mock_notifications", JSON.stringify(updated));
    } catch (e) {}
    
    try {
      const notifications = await notificationsService.getNotifications();
      notifications.forEach(n => addLocalReadId(n.id));
      
      await axiosInstance.put(`/DoctorBlog/notifications/read-all`);
    } catch (error) {
      // تجاهل الخطأ
    }
    return await notificationsService.getNotifications();
  },

  // حذف إشعار معين
  deleteNotification: async (id) => {
    addLocalDeletedId(id);
    try {
      const localNotifs = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
      const filtered = localNotifs.filter(n => n.id !== id);
      localStorage.setItem("mock_notifications", JSON.stringify(filtered));
    } catch (e) {}
    
    try {
      await axiosInstance.delete(`/DoctorBlog/notifications/${id}`);
    } catch (error) {
      // تجاهل الخطأ
    }
    return await notificationsService.getNotifications();
  },

  // مسح جميع الإشعارات
  clearAllNotifications: async () => {
    localStorage.removeItem("mock_notifications");
    try {
      const notifications = await notificationsService.getNotifications();
      notifications.forEach(n => addLocalDeletedId(n.id));
      
      await axiosInstance.delete(`/DoctorBlog/notifications/clear-all`);
    } catch (error) {
      // تجاهل الخطأ
    }
    return [];
  }
};