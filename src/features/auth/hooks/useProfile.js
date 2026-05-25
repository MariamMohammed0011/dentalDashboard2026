// // features/auth/hooks/useProfile.js
// import { useQuery } from "@tanstack/react-query"; 
// import axiosInstance from "../../../api/axios";

// export const useProfile = () => {
//   const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
//   const userId = userInfo.userId; // هنا سيبحث عن الرقم 12

//   return useQuery({
//     queryKey: ["user-profile", userId],
//     queryFn: async () => {
//       // سيطلب: /api/accounts/users/12
//       const response = await axiosInstance.get(`/accounts/users/${userId}`);
//       return response.data; // هنا الـ response.data يحتوي على الـ name والـ email
//     },
//     enabled: !!userId, // لن يعمل إلا إذا وجد الـ ID
//     staleTime: 1000 * 60 * 5,
//   });
// };
// features/auth/hooks/useProfile.js
import { useQuery } from "@tanstack/react-query"; 
import axiosInstance from "../../../api/axios";
import Cookies from "js-cookie"; // استيراد المكتبة لقراءة الكوكي

export const useProfile = () => {
  // جلب الـ userId من الكوكيز مباشرة
  const userId = Cookies.get("user_id"); 

  return useQuery({
    // طالما الـ userId ممرر هنا، سيعيد الـ Query جلب البيانات تلقائياً إذا تغير المستخدم
    queryKey: ["user-profile", userId], 
    
    queryFn: async () => {
      // سيطلب الرابط ديناميكياً بناءً على الـ id المخزن بالكوكي
      const response = await axiosInstance.get(`/accounts/users/${userId}`);
      return response.data; 
    },
    
    // حماية: لن يعمل الاستعلام ولن يضرب خطأ بالسيرفر إلا إذا كان الـ userId موجوداً في الكوكيز
    enabled: !!userId, 
    staleTime: 1000 * 60 * 5, // الكاش يبقى طازجاً لـ 5 دقائق
  });
};