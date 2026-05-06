/**
 * Interventions API Service
 */

const MOCK_INTERVENTIONS = Array(15).fill(null).map((_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? 'doctor' : 'lab',
  problemType: i % 3 === 0 ? 'خلل في مرور الطلب' : i % 3 === 1 ? 'خلل في التنفيذ' : 'خلل في النظام',
  affectedParty: i % 3 === 0 ? 'طبيب' : 'مخبر',
  orderNumber: '7120',
  failedOperation: 'ارسال الطلب الى المخبر',
  status: 'pending',
}));

export const interventionsApi = {
  getInterventions: async ({ type = 'all', page = 1, limit = 8 } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filtered = [...MOCK_INTERVENTIONS];
    if (type !== 'all') {
      filtered = filtered.filter(item => item.type === type);
    }

    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    
    return {
      data,
      pagination: {
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      }
    };
  }
};
