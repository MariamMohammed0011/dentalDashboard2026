import axiosInstance from '../../../api/axios';

const MOCK_REPORTS = Array(10).fill(null).map((_, i) => ({
  id: 22 - i,
  type: 'أطباء',
  duration: '1/1/2023 - 15/1/2023',
  orderStatus: 'جاهزة',
  deliveryStatus: 'لم يتم',
}));

export const reportsApi = {
  // تقرير مالي مجمع
  getConsolidatedFinancialReport: async () => {
    const response = await axiosInstance.get('/admin/Reports/financial/consolidated');
    return response.data;
  },

  // تقرير حالة الاشتراكات
  getSubscriptionsStatusReport: async (days = 7) => {
    const response = await axiosInstance.get('/admin/Reports/subscriptions/status-report', {
      params: { days }
    });
    return response.data;
  },

  // التقرير العام المحاكي (سابقاً)
  getReports: async ({ page = 1, limit = 8 } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const start = (page - 1) * limit;
    const data = MOCK_REPORTS.slice(start, start + limit);
    return {
      data,
      pagination: {
        total: MOCK_REPORTS.length,
        page,
        totalPages: Math.ceil(MOCK_REPORTS.length / limit),
      }
    };
  }
};
