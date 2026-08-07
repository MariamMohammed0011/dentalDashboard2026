import axiosInstance from "../../../api/axios";

export const labTechniciansApi = {
  getLabTechnicians: async () => {
    // استدعاء الإندبوينت الموحد
    const response = await axiosInstance.get("/Advertisement/all");
    const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);

    // فلترة المستخدمين بحسب الرول "Lab" فقط
    return data.filter(user => user.role === "Lab");
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