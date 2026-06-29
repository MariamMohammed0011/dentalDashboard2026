import axiosInstance from "../../../api/axios";

/**
 * Doctors API Service
 */

export const doctorsApi = {
  getDoctors: async () => {
    const response = await axiosInstance.get("/Users/dentists");
    return response.data;
  }
};

