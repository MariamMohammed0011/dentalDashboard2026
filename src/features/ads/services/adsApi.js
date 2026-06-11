import axiosInstance from "../../../api/axios";

// Helper function to map backend advertisement models to frontend expectations
const mapAdToFrontend = (ad) => {
  if (!ad) return null;

  // targetAudience can be "Labs", "Dentists", or numeric (1 for Labs, 0 for Dentists)
  const isLab = ad.targetAudience === 1 || 
                ad.target === 1 || 
                (ad.targetAudience && String(ad.targetAudience).toLowerCase().includes('lab')) ||
                (ad.target && String(ad.target).toLowerCase().includes('lab'));
  
  const type = isLab ? 'labs' : 'dentists';

  // Normalize image URL
  let imageUrl = ad.image || ad.imageUrl || ad.imagePath;
  if (!imageUrl && ad.attachments && ad.attachments.length > 0) {
    imageUrl = ad.attachments[0].path;
  }
  
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    // Relative path, prepend base URL
    const baseUrlClean = axiosInstance.defaults.baseURL.replace('/api', '');
    imageUrl = `${baseUrlClean}/${imageUrl.replace(/^\//, '')}`;
  }

  if (!imageUrl) {
    imageUrl = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';
  }

  // Map user/client details
  const ownerName = ad.userName || ad.user?.name || ad.user?.userName || ad.storeName || "مستخدم غير معروف";
  const ownerPhone = ad.userPhone || ad.user?.phoneNumber || ad.user?.phone || ad.storePhone || "";
  const ownerAvatar = ad.userAvatar || ad.user?.avatar || ad.storeAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=random`;

  // Normalize approval status
  let approvalStatus = 'pending';
  if (ad.isApproved === true || ad.approvalStatus === 'approved' || (ad.status && String(ad.status).toLowerCase() === 'approved')) {
    approvalStatus = 'approved';
  } else if (ad.isApproved === false && (ad.approvalStatus === 'rejected' || (ad.status && String(ad.status).toLowerCase() === 'rejected'))) {
    approvalStatus = 'rejected';
  }

  // Normalize active status
  const isActive = ad.isActive !== undefined ? ad.isActive : (ad.status === 'active');

  return {
    id: ad.id || ad.advertisementId,
    userId: ad.userId || ad.user?.id || ad.user?.userId || 2, // Used for accept-and-publish path
    title: ad.title || "",
    content: ad.content || "",
    type: type, // 'labs' or 'dentists'
    storeName: ownerName,
    storePhone: ownerPhone,
    storeAvatar: ownerAvatar,
    approvalStatus: approvalStatus, // 'pending', 'approved', 'rejected'
    status: isActive ? 'active' : 'inactive',
    image: imageUrl,
    expiresAt: ad.expiresAt ? ad.expiresAt.split('T')[0] : "",
    raw: ad
  };
};

export const adsApi = {
  getAds: async ({ page = 1, limit = 5, filters = {} } = {}) => {
    try {
      let endpoint = "/Advertisement/admin/all";
      
      // Determine endpoint based on filters.type (or target audience filter)
      if (filters.type === "labs") {
        endpoint = "/Advertisement/labs";
      } else if (filters.type === "dentists") {
        endpoint = "/Advertisement/dentists";
      }

      const response = await axiosInstance.get(endpoint);
      const rawAds = response.data || [];
      
      // Map and normalize all items
      let adsList = rawAds.map(mapAdToFrontend).filter(Boolean);

      // Apply client-side filters (fallback if backend doesn't filter)
      if (filters.approvalStatus && filters.approvalStatus !== 'all') {
        adsList = adsList.filter(ad => ad.approvalStatus === filters.approvalStatus);
      }
      if (filters.status && filters.status !== 'all') {
        adsList = adsList.filter(ad => ad.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        adsList = adsList.filter(ad => 
          ad.storeName.toLowerCase().includes(q) || 
          ad.storePhone.includes(q) || 
          ad.id.toString().includes(q) ||
          ad.title.toLowerCase().includes(q) ||
          ad.content.toLowerCase().includes(q)
        );
      }

      // Pagination
      const total = adsList.length;
      const start = (page - 1) * limit;
      const paginatedData = adsList.slice(start, start + limit);

      return {
        data: paginatedData,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit) || 1,
        }
      };
    } catch (error) {
      console.error("Error in getAds:", error);
      throw error;
    }
  },

  approveAd: async (userId, adId) => {
    try {
      const response = await axiosInstance.put(`/Advertisement/admin/accept-and-publish/user/${userId}/advertisement/${adId}`);
      return response.data;
    } catch (error) {
      console.error("Error in approveAd:", error);
      throw error;
    }
  },

  updateAd: async (id, updates) => {
    try {
      // If we are performing an approval, route it directly to approveAd
      if (updates.approvalStatus === 'approved') {
        const userId = updates.userId || 2;
        return await adsApi.approveAd(userId, id);
      }

      // Format update values into FormData since update endpoint uses form-data
      const formData = new FormData();
      if (updates.title) formData.append('Title', updates.title);
      if (updates.content) formData.append('Content', updates.content);
      
      const targetVal = (updates.type === 'labs' || updates.type === 'labs' || updates.targetAudience === 1) ? '1' : '0';
      formData.append('Target', targetVal);
      
      if (updates.expiresAt) formData.append('ExpiresAt', updates.expiresAt);
      
      // Standard backend PUT admin/update/{id}
      const response = await axiosInstance.put(`/Advertisement/admin/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateAd:", error);
      throw error;
    }
  },

  deleteAd: async (id) => {
    try {
      const response = await axiosInstance.delete(`/Advertisement/admin/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteAd:", error);
      throw error;
    }
  },

  createAd: async (ad) => {
    try {
      // 1. Create client first
      const clientFormData = new FormData();
      clientFormData.append('Name', ad.storeName);
      clientFormData.append('Phone', ad.storePhone);
      clientFormData.append('NamePlace', ad.storeName);
      clientFormData.append('AddressPlace', 'دمشق');
      clientFormData.append('CityPlace', 'دمشق');
      clientFormData.append('CountryPlace', 'سوريا');

      let userId = 2; // Default fallback user ID
      try {
        const clientRes = await axiosInstance.post('/Advertisement/admin/create-ads-client', clientFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (clientRes.data?.user?.id) {
          userId = clientRes.data.user.id;
        }
      } catch (clientErr) {
        console.warn("Could not create ad client, trying fallback:", clientErr);
        if (clientErr.response?.data?.user?.id) {
          userId = clientErr.response.data.user.id;
        }
      }

      // 2. Download the preset image and convert it to a file
      let imageBlob = null;
      try {
        if (ad.image && ad.image.startsWith('http')) {
          const imgRes = await fetch(ad.image);
          imageBlob = await imgRes.blob();
        }
      } catch (e) {
        console.error("Failed to fetch image blob", e);
      }

      // 3. Create advertisement
      const adFormData = new FormData();
      adFormData.append('Title', ad.storeName);
      adFormData.append('Content', ad.type === 'product' ? 'إعلان عن منتج' : 'إعلان عن متجر');
      
      const targetVal = (ad.type === 'labs' || ad.type === 'labs' || ad.targetAudience === 1) ? '1' : '0';
      adFormData.append('Target', targetVal);
      
      const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      adFormData.append('expiresAt', ad.expiresAt || oneYearLater);

      if (imageBlob) {
        adFormData.append('ImageFiles', imageBlob, 'ad_image.jpg');
      }

      const response = await axiosInstance.post(`/Advertisement/user/${userId}/advertisement`, adFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAd:", error);
      throw error;
    }
  },

  createAdForUser: async (userId, ad) => {
    try {
      let imageBlob = null;
      try {
        if (ad.image && ad.image.startsWith('http')) {
          const imgRes = await fetch(ad.image);
          imageBlob = await imgRes.blob();
        }
      } catch (e) {
        console.error("Failed to fetch image blob", e);
      }

      const adFormData = new FormData();
      adFormData.append('Title', ad.title || "إعلان جديد");
      adFormData.append('Content', ad.content || "محتوى الإعلان");
      
      const targetVal = (ad.type === 'labs' || ad.targetAudience === 1) ? '1' : '0';
      adFormData.append('Target', targetVal);
      
      const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      adFormData.append('expiresAt', ad.expiresAt || oneYearLater);

      if (imageBlob) {
        adFormData.append('ImageFiles', imageBlob, 'ad_image.jpg');
      }

      const response = await axiosInstance.post(`/Advertisement/user/${userId}/advertisement`, adFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAdForUser:", error);
      throw error;
    }
  },

  createAdClient: async (clientData) => {
    try {
      const formData = new FormData();
      formData.append('Name', clientData.name);
      formData.append('Phone', clientData.phone);
      formData.append('NamePlace', clientData.namePlace || clientData.name);
      formData.append('AddressPlace', clientData.addressPlace || 'دمشق');
      formData.append('CityPlace', clientData.cityPlace || 'دمشق');
      formData.append('CountryPlace', clientData.countryPlace || 'سوريا');

      const response = await axiosInstance.post('/Advertisement/admin/create-ads-client', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAdClient:", error);
      throw error;
    }
  }
};
