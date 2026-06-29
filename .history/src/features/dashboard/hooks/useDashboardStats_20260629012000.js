import { useState, useEffect } from "react";
import { statisticsApi } from "../services/statisticsApi";

export const useDashboardStats = () => {
  const [dentistsOrdersData, setDentistsOrdersData] = useState([]);
  const [labsOrdersData, setLabsOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStatistics = async () => {
      try {
        const [dentistsData, labsData] = await Promise.all([
          statisticsApi.getDentistsMonthlyOrders(),
          statisticsApi.getLabsMonthlyOrders()
        ]);
        if (isMounted) {
          const formattedDentists = (dentistsData || []).map(d => ({
            ...d,
            displayName: `${d.dentistName} (ID: ${d.dentistId})`
          }));
          const formattedLabs = (labsData || []).map(l => ({
            ...l,
            displayName: `${l.labName} (ID: ${l.labId})`
          }));

          setDentistsOrdersData(formattedDentists);
          setLabsOrdersData(formattedLabs);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard statistics in hook:", error);
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    };
    fetchStatistics();
    return () => {
      isMounted = false;
    };
  }, []);

  
  const getPeriodText = (data) => {
    if (data && data.length > 0 && data[0].year && data[0].month) {
      return `لشهر ${data[0].month} / ${data[0].year}`;
    }
    return 'لشهر 6 / 2026';
  };

  return {
    dentistsOrdersData,
    labsOrdersData,
    isLoading,
    isError,
    getPeriodText
  };
};
