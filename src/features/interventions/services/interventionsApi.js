import axiosInstance from '../../../api/axios';

export const interventionsApi = {
  // جلب شكاوى المخابر
  getLabComplaints: async () => {
    const response = await axiosInstance.get('/Complaints/labs');
    return Array.isArray(response.data) ? response.data : [];
  },

  // جلب شكاوى الإدارة
  getAdminComplaints: async () => {
    const response = await axiosInstance.get('/Complaints/admin');
    return Array.isArray(response.data) ? response.data : [];
  },

  // جلب كافة الشكاوى حسب التبويب المطلوب (الكل / الإدارة / المخابر)
  getComplaintsByType: async (type = 'all') => {
    if (type === 'admin') {
      const adminData = await interventionsApi.getAdminComplaints();
      return adminData.sort((a, b) => new Date(b.createdAtUtc || 0) - new Date(a.createdAtUtc || 0));
    }

    if (type === 'lab') {
      const labData = await interventionsApi.getLabComplaints();
      return labData.sort((a, b) => new Date(b.createdAtUtc || 0) - new Date(a.createdAtUtc || 0));
    }

    // النوع 'all' - جلب الاثنين ودمجهما
    const [labData, adminData] = await Promise.all([
      interventionsApi.getLabComplaints().catch(() => []),
      interventionsApi.getAdminComplaints().catch(() => [])
    ]);

    const combined = [...labData, ...adminData];
    return combined.sort((a, b) => new Date(b.createdAtUtc || 0) - new Date(a.createdAtUtc || 0));
  },

  // إرسال رد على الشكوى للـ API: POST /api/Complaints/reply/{userId}/{complaintId}
  replyToComplaint: async (userId, complaintId, replyText) => {
    try {
      // تجربة إرسال السلسلة النصية المباشرة JSON string
      const response = await axiosInstance.post(
        `/Complaints/reply/${userId}/${complaintId}`,
        JSON.stringify(replyText),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data;
    } catch (err) {
      // محاولة بديلة في حال كان كائن DTO متوقع { reply: "..." }
      const response = await axiosInstance.post(
        `/Complaints/reply/${userId}/${complaintId}`,
        { reply: replyText },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data;
    }
  }
};
