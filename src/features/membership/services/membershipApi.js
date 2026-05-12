import axiosInstance from "../../../api/axios";

export const membershipApi = {
  getMembershipRequests: async ({ type }) => {
    // دالة مساعدة لتوحيد تنسيق البيانات
    const normalize = (data, itemType) => data.map(item => ({
      ...item,
      type: itemType, 
      id: item.dentistId || item.labId || item.id,
      // Normalize status
      status: item.status === 'PendingAdminApproval' ? 'pending' : item.status.toLowerCase(),
      // Map document path to URL (derived from axios baseURL)
      documentUrl: item.verificationDocumentPath 
        ? `${axiosInstance.defaults.baseURL.replace('/api', '')}/${item.verificationDocumentPath}`
        : null
    }));

    if (type === 'all') {
      // جلب النوعين معاً في حالة "الكل"
      const [dentistsRes, labsRes] = await Promise.all([
        axiosInstance.get("/AdminAccounts/dentists/pending-approval"),
        axiosInstance.get("/AdminAccounts/labs/pending-approval")
      ]);

      const dentists = normalize(dentistsRes.data, 'doctor');
      const labs = normalize(labsRes.data, 'lab');

      return {
        data: [...dentists, ...labs]
      };
    }

    // جلب نوع واحد فقط (طبيب أو مخبر)
    const endpoint = type === 'lab' 
      ? "/AdminAccounts/labs/pending-approval" 
      : "/AdminAccounts/dentists/pending-approval";

    const response = await axiosInstance.get(endpoint);
    
    return {
      data: normalize(response.data, type === 'lab' ? 'lab' : 'doctor')
    };
  },

  // تحديث الحالة ليشمل (approve, reject, suspend)
  updateRequestStatus: async (id, status, type) => {
    const subPath = type === 'lab' ? 'labs' : 'dentists';
    
    // الخرائط بين الحالة المرسلة والـ Action المطلوب في الـ URL
    const actionMap = {
      'accepted': 'approve',
      'rejected': 'reject',
      'suspended': 'suspend'
    };

    const action = actionMap[status];
    
    // الرابط النهائي كما في Swagger: /api/AdminAccounts/{labs/dentists}/{id}/{action}
    const response = await axiosInstance.put(`/AdminAccounts/${subPath}/${id}/${action}`);
    return response.data;
  }
};