import axiosInstance from '../../../api/axios';
import { usersApi } from '../../ads/services/usersApi';

export const interventionsApi = {
  // جلب شكاوى المخابر
  getLabComplaints: async (usersMap = {}) => {
    const response = await axiosInstance.get('/Complaints/labs');
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map(item => ({
      ...item,
      user: usersMap[item.userId] || item.user || null
    }));
  },

  // جلب شكاوى الإدارة
  getAdminComplaints: async (usersMap = {}) => {
    const response = await axiosInstance.get('/Complaints/admin');
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map(item => ({
      ...item,
      user: usersMap[item.userId] || item.user || null
    }));
  },

  // جلب كافة الشكاوى حسب التبويب المطلوب (الكل / الإدارة / المخابر) مع ربط بيانات مقدم الشكوى (الطبيب/المستخدم)
  getComplaintsByType: async (type = 'all') => {
    let usersMap = {};
    try {
      const usersList = await usersApi.getUsers();
      if (Array.isArray(usersList)) {
        usersList.forEach(u => {
          if (u.id) usersMap[u.id] = u;
        });
      }
    } catch (e) {
      console.warn('Could not fetch users list for complaints mapping:', e);
    }

    if (type === 'admin') {
      const adminData = await interventionsApi.getAdminComplaints(usersMap);
      return adminData.sort((a, b) => new Date(b.createdAtUtc || 0) - new Date(a.createdAtUtc || 0));
    }

    if (type === 'lab') {
      const labData = await interventionsApi.getLabComplaints(usersMap);
      return labData.sort((a, b) => new Date(b.createdAtUtc || 0) - new Date(a.createdAtUtc || 0));
    }

    // النوع 'all' - جلب الاثنين ودمجهما
    const [labData, adminData] = await Promise.all([
      interventionsApi.getLabComplaints(usersMap).catch(() => []),
      interventionsApi.getAdminComplaints(usersMap).catch(() => [])
    ]);

    const combined = [...labData, ...adminData];
    return combined.sort((a, b) => new Date(b.createdAtUtc || 0) - new Date(a.createdAtUtc || 0));
  },

  // إرسال رد على الشكوى للـ API: POST /api/Complaints/reply/{userId}/{complaintId}
  replyToComplaint: async (userId, complaintId, replyText) => {
    try {
      const formData = new FormData();
      formData.append('ReplyText', replyText);

      const response = await axiosInstance.post(
        `/Complaints/reply/${userId}/${complaintId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error replying to complaint ${complaintId}:`, err);
      throw err;
    }
  }
};
