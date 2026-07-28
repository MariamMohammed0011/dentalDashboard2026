import axiosInstance from "../../../api/axios";
// doctorsApi.js
export const doctorsApi = {
  getDoctors: async () => {
    const response = await axiosInstance.get("/Users/dentists");
    return response.data;
  },

  updateStatus: async ({ id, status }) => {
    // نرسل الرقم المباشر في الـ Body
    const response = await axiosInstance.patch(`/Users/${id}/status`, {
      status: Number(status)
    });
    return response.data;
  },
};