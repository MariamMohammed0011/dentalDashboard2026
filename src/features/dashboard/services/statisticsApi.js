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
  },

  getFinancialGrowth: async (year = new Date().getFullYear()) => {
    try {
      const response = await axiosInstance.get(`/Financial/growth/${year}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching financial growth:", error);
      throw error;
    }
  },

  getRatingsChartData: async () => {
    try {
      const response = await axiosInstance.get("/Ratings/chart-data");
      return response.data;
    } catch (error) {
      console.error("Error fetching ratings chart data:", error);
      throw error;
    }
  },

  getCompensationsChart: async () => {
    try {
      const response = await axiosInstance.get("/CaseOrders/compensations-chart");
      return response.data;
    } catch (error) {
      console.error("Error fetching compensations chart data:", error);
      throw error;
    }
  },

  getStatusChart: async () => {
    try {
      const response = await axiosInstance.get("/CaseOrders/status-chart");
      return response.data;
    } catch (error) {
      console.error("Error fetching status chart data:", error);
      throw error;
    }
  }
};

