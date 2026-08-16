import axiosInstance from "../../../api/axios";

export const fetchActiveSubscriptions = async () => {
  const response = await axiosInstance.get("/LabSubscription/active-subscribed-labs");
  return response.data;
};

export const fetchExpiredSubscriptions = async () => {
  const response = await axiosInstance.get("/LabSubscription/expired-subscribed-labs");
  return response.data;
};

export const fetchPendingPaymentAccounts = async () => {
  const response = await axiosInstance.get("/AdminAccounts/pending-payment");
  return response.data;
};

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

export const updateAllSubscriptionAmounts = async (newAmount) => {
  const formData = new FormData();
  formData.append('newAmount', newAmount);

  const response = await axiosInstance.put('/LabSubscription/update-all-amounts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
