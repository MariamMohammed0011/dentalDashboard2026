import axiosInstance from "../../../api/axios";

// دالة تحويل حالة الطلبية إلى العربية لتطابق التصميم
const mapStatusArabic = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted": return "مقبول";
    case "pending": return "معلق";
    case "rejected": return "مرفوض";
    case "ready": return "جاهز";
    case "completed": return "مكتمل";
    default: return status || "غير محدد";
  }
};
// دالة تنسيق التاريخ باللغة الإنجليزية
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // تم تغيير الكود المحلي من "ar-EG" إلى "en-US" لتظهر الأرقام والتنسيق بالإنكليزي
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
};
export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/CaseOrders/all-with-details");
    const rawOrders = response.data || [];

    // التعديل السحري هنا: الترتيب تصاعدياً من الرقم الأصغر إلى الرقم الأكبر (1، 2، 3...)
    const sortedOrders = rawOrders.sort((a, b) => a.orderId - b.orderId);

    // مطابقة وتنسيق بيانات الطلبيات لتتوافق مع الأعمدة المعروضة في جدول الواجهة
    return sortedOrders.map(order => ({
      id: order.orderId,
      doctor: order.dentistName || "طبيب غير معروف",
      lab: order.labName || "مخبر غير معروف",

      orderStatus: mapStatusArabic(order.status),

      createdAt: formatDate(order.createdAt),

      // الاحتفاظ بجميع الحقول التفصيلية للعرض عند الضغط على زر التفاصيل (العين)
      title: order.title,
      status: order.status,
      impressionStage: order.impressionStage,
      impressionType: order.impressionType,
      shade: order.shade,
      isTemporary: order.isTemporary,
      isUrgent: order.isUrgent,
      deliveryDate: order.deliveryDate,
      notes: order.notes,
      estimatedPrice: order.estimatedPrice,
      finalPrice: order.finalPrice,
      hasAccessories: order.hasAccessories,
      dentistName: order.dentistName,
      dentistEmail: order.dentistEmail,
      dentistPhone: order.dentistPhone,
      labName: order.labName,
      items: order.items || [],
      raw: order
    }));
  } catch (error) {
    console.error("Failed to fetch case orders from API:", error);
    return [];
  }
};