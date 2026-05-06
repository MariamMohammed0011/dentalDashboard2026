/**
 * Doctors API Service
 */

const MOCK_DOCTORS = Array(20).fill(null).map((_, i) => ({
  id: i + 1,
  name: 'د. أحمد حسين',
  status: 'حالة الحساب: مفعل',
  image: `https://i.pravatar.cc/150?u=${i + 1}`,
}));

export const doctorsApi = {
  getDoctors: async ({ page = 1, limit = 12 } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const start = (page - 1) * limit;
    const data = MOCK_DOCTORS.slice(start, start + limit);
    return {
      data,
      pagination: {
        total: MOCK_DOCTORS.length,
        page,
        totalPages: Math.ceil(MOCK_DOCTORS.length / limit),
      }
    };
  }
};
