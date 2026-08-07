import axiosInstance from "../../../api/axios";

const mapStatusArabic = (status) => {
  switch (status?.toLowerCase()) {
    case "pennding":
    case "pending": return "قيد الانتظار";
    case "accepted": return "مقبولة";
    case "requestinfo": return "طلب معلومات";
    case "indesign": return "قيد التصميم";
    case "inproduction": return "قيد الإنتاج";
    case "incoloring": return "قيد التلوين";
    case "ready": return "جاهزة";
    case "delivered": return "تم التسليم";
    case "waitingforclarification": return "بانتظار توضيح";
    case "cancelled": return "ملغاة";
    default: return status || "غير محدد";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
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

    const sortedOrders = rawOrders.sort((a, b) => a.orderId - b.orderId);

    return sortedOrders.map(order => ({
      id: order.orderId,
      doctor: order.dentistName || "طبيب غير معروف",
      lab: order.labName || "مخبر غير معروف",

      orderStatus: mapStatusArabic(order.status),

      createdAt: formatDate(order.createdAt),

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

// جلب مسحات الـ STL الرقمية التابعة للطلبية GET /api/files/stl/{caseOrderId}
export const fetchOrderStlFiles = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/files/stl/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch STL files for order ${orderId}:`, error);
    return { caseOrderId: orderId, count: 0, data: [] };
  }
};