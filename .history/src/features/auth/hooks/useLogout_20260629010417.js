import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../../../api/axios";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
       const refreshToken = Cookies.get("refresh_token"); 

      const formData = new FormData();
      if (refreshToken) {
        formData.append("refreshToken", refreshToken); 
      }

      
      return await axiosInstance.post("/auth/logout", formData);
    },
    onSuccess: () => {
      
      Cookies.remove("auth_token", { secure: true, sameSite: "none" });
      Cookies.remove("refresh_token", { secure: true, sameSite: "none" });
      Cookies.remove("user_id", { secure: true, sameSite: "none" });
      Cookies.remove("user_role", { secure: true, sameSite: "none" });

      
      localStorage.removeItem("user_info");

      
      queryClient.clear();

      toast.success("تم تسجيل الخروج بنجاح");
      
      
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      
      Cookies.remove("auth_token", { secure: true, sameSite: "none" });
      Cookies.remove("refresh_token", { secure: true, sameSite: "none" });
      Cookies.remove("user_id", { secure: true, sameSite: "none" });
      Cookies.remove("user_role", { secure: true, sameSite: "none" });
      localStorage.removeItem("user_info");
      navigate("/login");
      console.error("Logout Error:", error);
    }
  });

  return {
    handleLogout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending
  };
};