import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/ordersApi";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
};
