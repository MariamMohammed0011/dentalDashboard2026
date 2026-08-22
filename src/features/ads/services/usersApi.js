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

      const response = await axiosInstance.get("/Advertisement/all");
      const allUsers = response.data || [];
      const mappedAllUsers = allUsers.map(mapUserToFrontend).filter(Boolean);


      if (!search || search.trim() === "") {
        return mappedAllUsers;
      }

      const queryTrimmed = search.trim();
      const searchUserIds = new Set();

      try {
        const formData = new FormData();
        formData.append("query", queryTrimmed);

        const searchResponse = await axiosInstance.post("/Users/search", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const searchData = searchResponse.data;

        const extractIds = (item) => {
          if (!item || typeof item !== 'object') return;
          const id = item.id ?? item.userId ?? item.user?.id;
          if (id !== undefined && id !== null) searchUserIds.add(String(id));
        };

        if (Array.isArray(searchData)) {
          searchData.forEach(extractIds);
        } else if (typeof searchData === 'object' && searchData !== null) {
          const categorized = searchData.categorizedResults || searchData.results || searchData;
          Object.values(categorized).forEach((list) => {
            if (Array.isArray(list)) list.forEach(extractIds);
            else if (typeof list === 'object') extractIds(list);
          });
        }
      } catch (searchError) {
        console.warn("Search users endpoint error, falling back to local search:", searchError);
      }

      return mappedAllUsers.filter((u) => {
        const isIdMatch = searchUserIds.has(String(u.id));
        const qLower = queryTrimmed.toLowerCase();
        const isTextMatch = (u.name && u.name.toLowerCase().includes(qLower)) ||
                            (u.phone && u.phone.includes(qLower)) ||
                            (u.namePlace && u.namePlace.toLowerCase().includes(qLower)) ||
                            (u.email && u.email.toLowerCase().includes(qLower));
        return isIdMatch || (searchUserIds.size === 0 && isTextMatch);
      });
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw error;
    }
  },
  updateUser: async (id, userData) => {
    try {
      const formData = new FormData();

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