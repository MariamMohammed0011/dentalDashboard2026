import axiosInstance from "../../../api/axios";

// 🔒 سجل محلي للإعلانات التي سعّرها الأدمن بالفعل، لضمان عدم عودة زر الموافقة
// حتى لو لم يُعِد الباك إند حقل السعر ضمن قائمة الإعلانات
const PRICED_ADS_KEY = "priced_advertisement_ids";

const getPricedAdIds = () => {
  try {
    return JSON.parse(localStorage.getItem(PRICED_ADS_KEY)) || [];
  } catch {
    return [];
  }
};

const addPricedAdId = (id) => {
  const ids = getPricedAdIds();
  const idStr = String(id);
  if (!ids.includes(idStr)) {
    ids.push(idStr);
    localStorage.setItem(PRICED_ADS_KEY, JSON.stringify(ids));
  }
};

const mapAdToFrontend = (ad, clients = [], audienceSets = null) => {
  if (!ad) return null;

  const userId = ad.userId || ad.user?.id || ad.user?.userId;
  const matchingClient = clients.find((c) => String(c.id) === String(userId));

  // الجمهور المستهدف حسب ترقيم الباك إند: 0 = أطباء الأسنان، 1 = المخابر، 2 = الاثنان معاً
  let type = 'dentists';
  const targetRaw = ad.targetAudience ?? ad.target ?? ad.targetAudienceId ?? ad.audienceType;
  if (targetRaw === 1 || targetRaw === '1' || (typeof targetRaw === 'string' && targetRaw.toLowerCase().includes('lab'))) {
    type = 'labs';
  } else if (targetRaw === 2 || targetRaw === '2' || (typeof targetRaw === 'string' && targetRaw.toLowerCase().includes('both'))) {
    type = 'both';
  } else if (targetRaw === undefined || targetRaw === null) {
    // الاعتماد على تصنيف الباك إند نفسه عبر نقطتي /dentists و /labs عند غياب الحقل الصريح
    const adIdStr = String(ad.id ?? ad.advertisementId ?? "");
    const inDentists = audienceSets?.dentistIds?.has(adIdStr);
    const inLabs = audienceSets?.labIds?.has(adIdStr);

    if (inDentists && inLabs) {
      type = 'both';
    } else if (inLabs) {
      type = 'labs';
    } else if (inDentists) {
      type = 'dentists';
    } else {
      // الملاذ الأخير: استنتاج الجمهور من نص العنوان
      const titleLower = (ad.title || "").toLowerCase();
      if (titleLower.includes("مخابر") && (titleLower.includes("أطباء") || titleLower.includes("اطباء"))) {
        type = "both";
      } else if (titleLower.includes("مخابر") || titleLower.includes("مخبر")) {
        type = "labs";
      } else if (titleLower.includes("أطباء") || titleLower.includes("اطباء") || titleLower.includes("اسنان") || titleLower.includes("أسنان")) {
        type = "dentists";
      }
    }
  }

  const baseUrlClean = axiosInstance.defaults.baseURL.replace('/api', '');
  let adImages = [];

  if (ad.images && ad.images.length > 0) {
    adImages = ad.images.map(img => {
      if (img.startsWith('http') || img.startsWith('data:')) {
        return img;
      }
      return `${baseUrlClean}/${img.replace(/^\//, '')}`;
    });
  } else {
    const fallbackImage = ad.image || ad.imageUrl || ad.imagePath || null;
    if (fallbackImage) {
      if (fallbackImage.startsWith('http') || fallbackImage.startsWith('data:')) {
        adImages = [fallbackImage];
      } else {
        adImages = [`${baseUrlClean}/${fallbackImage.replace(/^\//, '')}`];
      }
    } else if (ad.attachments && ad.attachments.length > 0) {
      adImages = ad.attachments.map(att => {
        const path = att.path || att;
        if (path.startsWith('http') || path.startsWith('data:')) {
          return path;
        }
        return `${baseUrlClean}/${path.replace(/^\//, '')}`;
      });
    }
  }

  if (adImages.length === 0) {
    adImages = ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'];
  }

  const imageUrl = adImages[0];

  const ownerName = matchingClient?.name || ad.userName || ad.user?.name || ad.user?.userName || ad.storeName
    || (userId ? `مستخدم #${userId}` : "مستخدم غير معروف");
  const storeNameVal = matchingClient?.namePlace || ownerName;
  const ownerPhone = matchingClient?.phone || ad.userPhone || ad.user?.phoneNumber || ad.user?.phone || ad.storePhone || "";
  const ownerAvatar = ad.userAvatar || ad.user?.avatar || ad.storeAvatar
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=367AFF&color=fff`;

  // السعر المحدد يعني أن الأدمن اعتمد الإعلان وأرسل السعر عبر accept-and-publish
  // ويتم الاعتماد أيضاً على السجل المحلي لأن عملية التسعير تتم مرة واحدة فقط ولا يجوز تكرارها
  const adIdVal = ad.id ?? ad.advertisementId;
  const adPrice = ad.price ?? ad.cost ?? 0;
  const hasPrice = Number(adPrice) > 0 || getPricedAdIds().includes(String(adIdVal));

  const isActive = ad.isActive !== undefined ? ad.isActive : (ad.status === 'active');

  // 🎯 تحديد مصدر الإعلان: عملاء الإعلانات (ADSClient) يتم إنشاؤهم من قبل الأدمن،
  // أما الأطباء والمخابر فطلباتهم تصل من تطبيق الموبايل وتحتاج موافقة وتسعير
  const ownerRole = matchingClient?.role || ad.user?.role || ad.userRole || "";
  const isAdminCreated = String(ownerRole).toLowerCase() === 'adsclient';

  // ⚠️ حالة الموافقة منفصلة عن حالة التفعيل (isActive) بالنسبة لطلبات التطبيق:
  // فالإعلان قد يكون مُسعَّراً لكن الطبيب لم يدفع بعد، أو موافَقاً عليه لكنه موقوف مؤقتاً.
  // أما إعلانات الأدمن فلا تمر بمرحلة مراجعة أصلاً لأنه هو من أنشأها ونشرها مباشرة.
  let approvalStatus = 'pending';
  if (
    ad.isApproved === true
    || ad.approvalStatus === 'approved'
    || (ad.status && String(ad.status).toLowerCase() === 'approved')
    || hasPrice
    || isAdminCreated
  ) {
    approvalStatus = 'approved';
  } else if (ad.isApproved === false && (ad.approvalStatus === 'rejected' || (ad.status && String(ad.status).toLowerCase() === 'rejected'))) {
    approvalStatus = 'rejected';
  }

  return {
    id: ad.id || ad.advertisementId,
    userId: userId || 2,
    ownerRole,
    isAdminCreated,
    hasPrice,
    title: ad.title || "",
    content: ad.content || "",
    type: type,
    storeName: storeNameVal,
    storePhone: ownerPhone,
    storeAvatar: ownerAvatar,
    approvalStatus: approvalStatus,
    status: isActive ? 'active' : 'inactive',
    image: imageUrl,
    images: adImages,
    expiresAt: ad.expiresAt ? ad.expiresAt.split('T')[0] : "",
    createdAt: ad.createdAt || "",
    price: adPrice,
    raw: ad
  };
};


export const adsApi = {
  getAds: async ({ page = 1, limit = 5, filters = {} } = {}) => {
    try {
      // الجلب دائماً من نقطة الأدمن لأنها الوحيدة التي تُرجع حالة الموافقة والسعر،
      // بينما تُستخدم نقطتا /dentists و /labs كمرجع لتصنيف الجمهور المستهدف فقط
      const [adsResponse, clientsResponse, dentistsResponse, labsResponse] = await Promise.allSettled([
        axiosInstance.get("/Advertisement/admin/all"),
        axiosInstance.get("/Advertisement/all"),
        axiosInstance.get("/Advertisement/dentists"),
        axiosInstance.get("/Advertisement/labs")
      ]);

      const rawAds = adsResponse.status === "fulfilled" ? (adsResponse.value.data || []) : [];
      const rawClients = clientsResponse.status === "fulfilled" ? (clientsResponse.value.data || []) : [];
      const dentistAds = dentistsResponse.status === "fulfilled" ? (dentistsResponse.value.data || []) : [];
      const labAds = labsResponse.status === "fulfilled" ? (labsResponse.value.data || []) : [];

      const audienceSets = {
        dentistIds: new Set(dentistAds.map((a) => String(a.id))),
        labIds: new Set(labAds.map((a) => String(a.id)))
      };

      let adsList = rawAds.map((ad) => mapAdToFrontend(ad, rawClients, audienceSets)).filter(Boolean);

      // فلترة الجمهور المستهدف (أطباء / مخابر / الاثنان معاً)
      if (filters.type && filters.type !== 'all') {
        adsList = adsList.filter(ad => ad.type === filters.type);
      }
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

  // جلب قائمة الجماهير المستهدفة المعتمدة من الباك إند (0 = أطباء، 1 = مخابر، 2 = الاثنان)
  getTargetAudiences: async () => {
    try {
      const response = await axiosInstance.get('/Advertisement/target-audiences');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error in getTargetAudiences:", error);
      return [];
    }
  },

  approveAd: async (userId, adId, price = 0) => {
    try {
      const formData = new FormData();
      formData.append('price', String(price));
      formData.append('Price', String(price));

      const response = await axiosInstance.patch(
        `/Advertisement/admin/accept-and-publish/user/${userId}/advertisement/${adId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      // تسجيل الإعلان كمُسعَّر بعد نجاح العملية لمنع إعادة التسعير نهائياً
      addPricedAdId(adId);

      return response.data;
    } catch (error) {
      console.error("Error in approveAd:", error);
      throw error;
    }
  },

  updateAd: async (id, updates) => {
    try {
      if (updates.approvalStatus === 'approved') {
        const userId = updates.userId || 2;
        return await adsApi.approveAd(userId, id, updates.price || 0);
      }

      const formData = new FormData();
      if (updates.title) formData.append('Title', updates.title);
      if (updates.content) formData.append('Content', updates.content);

      const targetVal = updates.type === 'labs' ? '1' : updates.type === 'both' ? '2' : '0';
      formData.append('Target', targetVal);

      if (updates.expiresAt) {
        formData.append('ExpiresAt', updates.expiresAt);
        formData.append('expiresAt', updates.expiresAt);
      }

      if (updates.image instanceof File) {
        formData.append('ImageFiles', updates.image);
      }

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

      const clientFormData = new FormData();
      clientFormData.append('Name', ad.storeName);
      clientFormData.append('Phone', ad.storePhone);
      clientFormData.append('NamePlace', ad.storeName);
      clientFormData.append('AddressPlace', 'دمشق');
      clientFormData.append('CityPlace', 'دمشق');
      clientFormData.append('CountryPlace', 'سوريا');

      let userId = 2;
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
      adFormData.append('Title', ad.storeName);
      adFormData.append('Content', ad.type === 'product' ? 'إعلان عن منتج' : 'إعلان عن متجر');

      const targetVal = ad.type === 'labs' ? '1' : ad.type === 'both' ? '2' : '0';
      adFormData.append('Target', targetVal);

      const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      adFormData.append('ExpiresAt', ad.expiresAt || oneYearLater);
      adFormData.append('expiresAt', ad.expiresAt || oneYearLater);

      if (ad.image instanceof File) {
        adFormData.append('ImageFiles', ad.image);
      } else if (imageBlob) {
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

      const targetVal = ad.type === 'labs' ? '1' : ad.type === 'both' ? '2' : '0';
      adFormData.append('Target', targetVal);

      const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      adFormData.append('ExpiresAt', ad.expiresAt || oneYearLater);
      adFormData.append('expiresAt', ad.expiresAt || oneYearLater);

      if (ad.image instanceof File) {
        adFormData.append('ImageFiles', ad.image);
      } else if (imageBlob) {
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
  },

  getUserValidAds: async (userId) => {
    try {

      const [adsResponse, clientsResponse] = await Promise.allSettled([
        axiosInstance.get("/Advertisement/admin/all"),
        axiosInstance.get("/Advertisement/all")
      ]);

      const rawAds = adsResponse.status === "fulfilled" ? (adsResponse.value.data || []) : [];
      const rawClients = clientsResponse.status === "fulfilled" ? (clientsResponse.value.data || []) : [];

      const allMappedAds = rawAds.map(ad => mapAdToFrontend(ad, rawClients)).filter(Boolean);
      const userAds = allMappedAds.filter(ad => String(ad.userId) === String(userId));

      const activeUserAds = userAds.filter(ad => ad.status === 'active' || ad.raw?.isActive === true);

      const formattedAds = activeUserAds.map(ad => ({
        id: ad.id,
        imageUrl: ad.image || ad.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        title: ad.title,
        content: ad.content,
        price: ad.price,
        createdAt: ad.createdAt,
        expiresAt: ad.expiresAt
      }));

      return {
        totalCount: formattedAds.length,
        message: formattedAds.length === 0 ? "لا يوجد إعلانات نشطة وصالحة لهذا المستخدم حالياً." : null,
        advertisements: formattedAds
      };
    } catch (error) {
      console.error("Error in getUserValidAds:", error);
      throw error;
    }
  },

  getActiveAdsCount: async () => {
    try {
      const response = await axiosInstance.get("/Advertisement/admin/all");
      const ads = response.data || [];
      const activeCount = ads.filter(ad => ad.isActive === true || ad.status === 'active').length;
      return activeCount;
    } catch (error) {
      console.error("Error in getActiveAdsCount:", error);
      throw error;
    }
  },

  getAllRawAds: async () => {
    try {
      const response = await axiosInstance.get("/Advertisement/admin/all");
      return response.data || [];
    } catch (error) {
      console.error("Error in getAllRawAds:", error);
      throw error;
    }
  }
};
