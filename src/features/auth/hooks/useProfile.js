// features/auth/hooks/useProfile.js
import { useQuery } from "@tanstack/react-query"; 
import axiosInstance from "../../../api/axios";

export const useProfile = () => {
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const userId = userInfo.userId; // هنا سيبحث عن الرقم 12

  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      // سيطلب: /api/accounts/users/12
      const response = await axiosInstance.get(`/accounts/users/${userId}`);
      return response.data; // هنا الـ response.data يحتوي على الـ name والـ email
    },
    enabled: !!userId, // لن يعمل إلا إذا وجد الـ ID
    staleTime: 1000 * 60 * 5,
  });
};