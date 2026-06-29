import axiosInstance from "../../../api/axios";

export const statisticsApi = {
   getDentistsMonthlyOrders: async () => {
    try {
      const response = await axiosInstance.get("/Statistics/dentists-monthly-orders");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching dentists monthly orders:", error);
      throw error;
    }
  },

  getLabsMonthlyOrders: async () => {
    try {
      const response = await axiosInstance.get("/Statistics/labs-monthly-orders");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching labs monthly orders:", error);
      throw error;
    }
  }
};
