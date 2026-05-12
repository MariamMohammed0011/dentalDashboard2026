import axios from "axios";
import Cookies from "js-cookie"; // استيراد المكتبة هنا أيضاً

const axiosInstance = axios.create({
  baseURL: "https://localhost:44334/api",
  withCredentials: true,
  
});

axiosInstance.interceptors.request.use(
  (config) => {
    // جلب التوكن من الكوكيز
    const token = Cookies.get("auth_token"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;