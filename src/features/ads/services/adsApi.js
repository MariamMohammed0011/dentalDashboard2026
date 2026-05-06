/**
 * Ads API Service
 */

const MOCK_ADS = Array(12).fill(null).map((_, i) => ({
  id: i + 1,
  source: 'د. أحمد غانم',
  duration: '7 أيام',
  paymentStatus: 'دفع كامل المبلغ',
  image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80', // صورة طبية عشوائية
}));

export const adsApi = {
  getAds: async ({ page = 1, limit = 8 } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const start = (page - 1) * limit;
    const data = MOCK_ADS.slice(start, start + limit);
    return {
      data,
      pagination: {
        total: MOCK_ADS.length,
        page,
        totalPages: Math.ceil(MOCK_ADS.length / limit),
      }
    };
  }
};
