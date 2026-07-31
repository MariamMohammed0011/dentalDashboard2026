import axiosInstance from "../../../api/axios";

export const labsApi = {
  
  getLabs: async () => {
    const response = await axiosInstance.get("/Labs/all");
    const labsList = response.data || [];
    
    try {
      const usersRes = await axiosInstance.get("/Advertisement/all");
      const users = usersRes.data || [];
      const labUsers = users.filter(u => String(u.role).toLowerCase() === 'lab');

      return labsList.map((lab, index) => {
        const matchingUser = labUsers.find(u => 
          String(u.id) === String(lab.userId || lab.id) ||
          u.namePlace?.toLowerCase() === lab.name?.toLowerCase() ||
          u.email?.toLowerCase() === lab.email?.toLowerCase()
        ) || labUsers[index];

        return {
          ...lab,
          userId: matchingUser ? matchingUser.id : lab.id,
          status: matchingUser?.status || lab.status
        };
      });
    } catch (err) {
      console.warn("Could not map users for labs:", err);
      return labsList;
    }
  },

  getLabDetails: async (id) => {
    if (!id) return null;
    const response = await axiosInstance.get(`/Accounts/labs/${id}`);
    return response.data;
  },

  updateStatus: async ({ id, status }) => {
    let targetUserId = id;

    try {
      // 💡 جلب قائمة المستخدمين من /Advertisement/all للحصول على الـ User ID المناسب بدلاً من ID البروفايل
      const usersRes = await axiosInstance.get("/Advertisement/all");
      const users = usersRes.data || [];
      const labUsers = users.filter(u => String(u.role).toLowerCase() === 'lab');

      // البحث عن كائن المستخدم المقابل لـ ID المخبر
      const matchingUser = labUsers.find(u => 
        String(u.id) === String(id) || 
        u.labProfile?.id === id || 
        String(u.labProfile?.labId) === String(id) ||
        u.namePlace?.toLowerCase() === String(id).toLowerCase()
      ) || labUsers.find(u => String(u.id) === String(id)) || labUsers[0];

      if (matchingUser) {
        targetUserId = matchingUser.id;
      }
    } catch (err) {
      console.warn("Could not fetch user ID mapping for lab status update:", err);
    }

    const formData = new FormData();
    formData.append("Status", Number(status));

    console.log(`📡 Sending PATCH /Users/${targetUserId}/status with Status =`, status);

    const response = await axiosInstance.patch(
      `/Users/${targetUserId}/status`,
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
