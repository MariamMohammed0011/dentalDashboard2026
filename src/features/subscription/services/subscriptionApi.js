import axiosInstance from "../../../api/axios";

export const fetchActiveSubscriptions = async () => {
  const response = await axiosInstance.get("/LabSubscription/active-subscribed-labs");
  return response.data;
};

export const activateSubscription = async (labId) => {
  const response = await axiosInstance.post(`/LabSubscription/lab/${labId}/activate-subscription`);
  return response.data;
};

export const renewSubscription = async (labId) => {
  const response = await axiosInstance.post(`/LabSubscription/${labId}/renew`);
  return response.data;
};
