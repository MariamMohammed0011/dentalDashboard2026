import axiosInstance from "../../../api/axios";

/**
 * Labs API Service
 */
export const labsApi = {
  // Fetch list of all labs (returns an array of LabDto: { id, name })
  getLabs: async () => {
    const response = await axiosInstance.get("/Labs/all");
    return response.data || [];
  },

  // Fetch detailed lab profile (including rating, specialties, materials, owner info, etc.)
  getLabDetails: async (id) => {
    if (!id) return null;
    const response = await axiosInstance.get(`/Accounts/labs/${id}`);
    return response.data;
  }
};
