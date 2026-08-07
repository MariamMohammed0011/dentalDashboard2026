import axiosInstance from "../../../api/axios";

// 1. جلب الاشتراكات النشطة
export const fetchActiveSubscriptions = async () => {
  const response = await axiosInstance.get("/LabSubscription/active-subscribed-labs");
  return response.data;
};

// 2. جلب أرشيف الاشتراكات المنتهية
export const fetchExpiredSubscriptions = async () => {
  const response = await axiosInstance.get("/LabSubscription/expired-subscribed-labs");
  return response.data;
};

// 3. تفعيل اشتراك لمخبر
export const activateSubscription = async (labId, payload) => {
  const formData = new FormData();
  formData.append('Amount', payload.amount);
  formData.append('PeriodStartUtc', payload.periodStartUtc);
  formData.append('PeriodEndUtc', payload.periodEndUtc);
  
  const response = await axiosInstance.post(`/LabSubscription/lab/${labId}/activate-subscription`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// 4. تجديد اشتراك لمخبر
export const renewSubscription = async (labId, payload) => {
  const formData = new FormData();
  formData.append('Amount', payload.amount);
  formData.append('PeriodStartUtc', payload.periodStartUtc);
  formData.append('PeriodEndUtc', payload.periodEndUtc);

  const response = await axiosInstance.post(`/LabSubscription/${labId}/renew`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
