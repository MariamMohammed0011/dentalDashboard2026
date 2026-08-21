import axios from "axios";
import Cookies from "js-cookie"; 

// const axiosInstance = axios.create({
//   // baseURL: "https://osnet.shop/dentconnect/api",
 
//   // baseURL: "https://localhost:44334/api",
//   baseURL: import.meta.env.VITE_API_BASE_URL,
  
// });
const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL: `${base}/api`,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

axiosInstance.interceptors.request.use(
  (config) => {
   
    const token = Cookies.get("auth_token"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;