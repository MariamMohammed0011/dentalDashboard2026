import axiosInstance from "../../../api/axios";

export const membershipApi = {
  getMembershipRequests: async ({ type }) => {
    // تحديد الرابط بناءً على النوع (طبيب أو مخبر)
    const endpoint = type === 'lab' 
      ? "/AdminAccounts/labs/pending-approval" 
      : "/AdminAccounts/dentists/pending-approval";

    const response = await axiosInstance.get(endpoint);
    
    return {
      data: response.data.map(item => ({
        ...item,
        type: type === 'lab' ? 'lab' : 'doctor', 
        id: item.dentistId || item.labId || item.id,
        // Normalize status
        status: item.status === 'PendingAdminApproval' ? 'pending' : item.status.toLowerCase(),
        // Map document path to URL (derived from axios baseURL)
        documentUrl: item.verificationDocumentPath 
          ? `${axiosInstance.defaults.baseURL.replace('/api', '')}/${item.verificationDocumentPath}`
          : null
      }))
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