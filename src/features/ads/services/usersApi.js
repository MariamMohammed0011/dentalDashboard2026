import axiosInstance from "../../../api/axios";

const mapUserToFrontend = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "",
    status: user.status || "",
    namePlace: user.namePlace || "",
    addressPlace: user.addressPlace || "",
    cityPlace: user.cityPlace || "",
    countryPlace: user.countryPlace || "",
    verificationDocumentPath: user.verificationDocumentPath,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,

    advertisements: user.advertisements || [],
    createdCases: user.createdCases || [],
    labProfile: user.labProfile,
    sentConnectionRequests: user.sentConnectionRequests || [],
    notifications: user.notifications || [],
    refreshTokens: user.refreshTokens || [],

    advertisementsCount: user.advertisements?.length || 0,
    createdCasesCount: user.createdCases?.length || 0,
    notificationsCount: user.notifications?.length || 0,
  };
};

export const usersApi = {
  getUsers: async (search = "") => {
    try {
      // 1. جلب جميع عملاء الإعلانات بالبيانات الكاملة
      const response = await axiosInstance.get("/Advertisement/all");
      const allUsers = response.data || [];
      const mappedAllUsers = allUsers.map(mapUserToFrontend).filter(Boolean);

      // 2. إذا لم يكن هناك نص بحث، نعيد القائمة الكاملة مباشرة
      if (!search || search.trim() === "") {
        return mappedAllUsers;
      }

      // 3. إذا كان هناك نص بحث، نرسل طلب البحث للباك إند
      const formData = new FormData();
      formData.append("query", search);

      const searchResponse = await axiosInstance.post("/Users/search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const categorizedResults = searchResponse.data?.categorizedResults || {};
      
      // استخراج معرّفات المستخدمين من نتائج البحث
      const searchUserIds = Object.values(categorizedResults).flatMap((list) => 
        (list || []).map((u) => u.id)
      );

      // 4. تصفية قائمة عملاء الإعلانات بناءً على معرّفات نتائج البحث المطابقة
      return mappedAllUsers.filter((u) => searchUserIds.includes(u.id));
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw error;
    }
  },
  updateUser: async (id, userData) => {
    try {
      const formData = new FormData();
      
      // تحويل الكائن المرسل إلى FormData متوافق مع الباك إند
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await axiosInstance.put(`/Advertisement/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/Advertisement/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};