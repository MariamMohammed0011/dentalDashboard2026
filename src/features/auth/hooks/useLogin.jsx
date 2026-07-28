import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import axiosInstance from "../../../api/axios";
import i18n from "../../../i18n";

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    
    mutationFn: async ({ credentials, rememberMe }) => {
      const formData = new FormData();
      formData.append("email", credentials.username);
      formData.append("password", credentials.password);
      
      const response = await axiosInstance.post("/auth/login", formData);
      
      
      return { ...response.data, rememberMe };
    },

    onSuccess: (data) => {
  const isLocalhost = window.location.hostname === "localhost";

  const tokenExpiry = data.rememberMe ? 7 : undefined;
  const refreshExpiry = data.rememberMe ? 30 : undefined;

  const cookieConfig = isLocalhost 
    ? (tokenExpiry ? { expires: tokenExpiry } : {}) 
    : { expires: tokenExpiry, secure: true, sameSite: "none" }; 

  const refreshConfig = isLocalhost 
    ? (refreshExpiry ? { expires: refreshExpiry } : {}) 
    : { expires: refreshExpiry, secure: true, sameSite: "none" };

  
  Cookies.set("auth_token", data.accessToken, cookieConfig);

  
  Cookies.set("refresh_token", data.refreshToken, refreshConfig);

  
  Cookies.set("user_id", data.userId, cookieConfig);
  Cookies.set("user_role", data.role, cookieConfig);

  toast.success(i18n.t("auth.loginSuccess"));
  setTimeout(() => navigate("/dashboard"), 500);
},
    onError: (error) => {
      const errorMessage = error.response?.data?.message || i18n.t("auth.unexpectedError");
      toast.error(errorMessage);
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    
    const rememberMe = formData.has("rememberMe");
    const payload = Object.fromEntries(formData);

    if (!payload.username || !payload.password) {
      toast.warning(i18n.t("auth.fillAllFields"));
      return;
    }

    
    mutate({ credentials: payload, rememberMe });
  };

  return { handleLogin, isPending };
};