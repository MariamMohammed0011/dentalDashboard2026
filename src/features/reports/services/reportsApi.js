import axiosInstance from '../../../api/axios';

export const reportsApi = {
  // تقرير مالي مجمع (من الباك إند)
  getConsolidatedFinancialReport: async () => {
    const response = await axiosInstance.get('/admin/Reports/financial/consolidated');
    return response.data;
  },

  // تقرير حالة الاشتراكات للمخابر (من الباك إند)
  getSubscriptionsStatusReport: async (days = 7) => {
    const response = await axiosInstance.get('/admin/Reports/subscriptions/status-report', {
      params: { days }
    });
    return response.data;
  },
};

