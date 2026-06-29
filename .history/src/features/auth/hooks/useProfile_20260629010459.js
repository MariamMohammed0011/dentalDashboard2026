
import { useQuery } from "@tanstack/react-query"; 
import axiosInstance from "../../../api/axios";
import Cookies from "js-cookie"; 

export const useProfile = () => {
  
  const userId = Cookies.get("user_id"); 

  return useQuery({
    
    queryKey: ["user-profile", userId], 
    
    queryFn: async () => {
      
      const response = await axiosInstance.get(`/accounts/users/${userId}`);
      return response.data; 
    },
    
    enabled: !!userId, 
    staleTime: 1000 * 60 * 5, // الكاش يبقى طازجاً لـ 5 دقائق
  });
};