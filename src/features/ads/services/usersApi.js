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
  getUsers: async () => {
    try {
      const response = await axiosInstance.get("/Advertisement/all");

      const users = response.data || [];

      return users
        .map(mapUserToFrontend)
        .filter(Boolean);
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw error;
    }
  },
};