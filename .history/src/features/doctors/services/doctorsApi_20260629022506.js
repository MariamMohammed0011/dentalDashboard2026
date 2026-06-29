import axiosInstance from "../../../api/axios";


export const doctorsApi = {
  getDoctors: async () => {
    const response = await axiosInstance.get("/Users/dentists");
    return response.data;
  }
};

