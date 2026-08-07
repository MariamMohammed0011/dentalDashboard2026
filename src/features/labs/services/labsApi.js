import axiosInstance from "../../../api/axios";

export const labsApi = {
  getLabs: async () => {
    const response = await axiosInstance.get("/Labs");
    const resData = response.data;
    if (resData && Array.isArray(resData.data)) {
      return resData.data;
    }
    return Array.isArray(resData) ? resData : [];
  },

  updateStatus: async ({ id, status }) => {
    const formData = new FormData();
    formData.append("Status", Number(status));

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
  }
};