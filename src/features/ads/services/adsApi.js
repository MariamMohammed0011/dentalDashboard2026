/**
 * Ads API Service
 */

let MOCK_ADS = [
  {
    id: 26,
    type: 'product',
    storeName: 'kais store',
    storePhone: '96398105323+',
    storeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'pending',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 25,
    type: 'product',
    storeName: 'kais store',
    storePhone: '96398105323+',
    storeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'rejected',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 15,
    type: 'store',
    storeName: 'testy4u',
    storePhone: '963984132630+',
    storeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'approved',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 14,
    type: 'store',
    storeName: 'kais store',
    storePhone: '96398105323+',
    storeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'approved',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 13,
    type: 'product',
    storeName: 'التقوى لطب الأسنان',
    storePhone: '963955123456+',
    storeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'pending',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 12,
    type: 'store',
    storeName: 'Dental Corner',
    storePhone: '963933987654+',
    storeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'approved',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 11,
    type: 'product',
    storeName: 'عيادة كير هيلث',
    storePhone: '963944111222+',
    storeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'approved',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 10,
    type: 'store',
    storeName: 'صيدلية الشفاء',
    storePhone: '963999888777+',
    storeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    approvalStatus: 'pending',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80'
  }
];

export const adsApi = {
  getAds: async ({ page = 1, limit = 5, filters = {} } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...MOCK_ADS];
    
    // Apply filters
    if (filters.approvalStatus && filters.approvalStatus !== 'all') {
      filtered = filtered.filter(ad => ad.approvalStatus === filters.approvalStatus);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(ad => ad.status === filters.status);
    }
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(ad => ad.type === filters.type);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.storeName.toLowerCase().includes(q) || 
        ad.storePhone.includes(q) || 
        ad.id.toString().includes(q)
      );
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
  },
  
  updateAd: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    MOCK_ADS = MOCK_ADS.map(ad => ad.id === id ? { ...ad, ...updates } : ad);
    return { success: true };
  },

  deleteAd: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    MOCK_ADS = MOCK_ADS.filter(ad => ad.id !== id);
    return { success: true };
  },

  createAd: async (ad) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newId = MOCK_ADS.length > 0 ? Math.max(...MOCK_ADS.map(a => a.id)) + 1 : 1;
    const newAd = {
      id: newId,
      approvalStatus: 'pending',
      status: 'inactive',
      storeAvatar: ad.storeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      ...ad
    };
    MOCK_ADS = [newAd, ...MOCK_ADS];
    return newAd;
  }
};
