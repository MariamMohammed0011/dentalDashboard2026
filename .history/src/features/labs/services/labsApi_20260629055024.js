import axiosInstance from "../../../api/axios";

export const labsApi = {
  
  getLabs: async () => {
    const response = await axiosInstance.get("/Labs/all");
    return response.data || [];
  },

  
  getLabDetails: async (id) => {
    if (!id) return null;
    const response = await axiosInstance.get(`/Accounts/labs/${id}`);
    return response.data;
  }
};
