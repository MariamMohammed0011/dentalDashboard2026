import axiosInstance from "../../../api/axios";

export const doctorsApi = {
  getDoctors: async () => {
    const response = await axiosInstance.get("/Users/dentists");
    return response.data;
  },

  updateStatus: async ({ id, status }) => {
    const formData = new FormData();

    formData.append("Status", Number(status));
    console.log("Sending Status =", status);
    const response = await axiosInstance.patch(
      `/Users/${id}/status`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};