import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reportsApi';

export const useReports = (initialDays = 7) => {
  const [days, setDays] = useState(initialDays);

  // 1. تقرير المالية المجمع (من الباك إند)
  const financialQuery = useQuery({
    queryKey: ['financialConsolidatedReport'],
    queryFn: reportsApi.getConsolidatedFinancialReport,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // 2. تقرير حالة الاشتراكات (من الباك إند)
  const subscriptionQuery = useQuery({
    queryKey: ['subscriptionsStatusReport', days],
    queryFn: () => reportsApi.getSubscriptionsStatusReport(days),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const isLoading = financialQuery.isLoading || subscriptionQuery.isLoading;
  const isError = financialQuery.isError || subscriptionQuery.isError;

  return {
    // البيانات المالية
    financialData: financialQuery.data || null,
    isFinancialLoading: financialQuery.isLoading,
    financialError: financialQuery.error,

    // بيانات الاشتراكات
    subscriptionData: subscriptionQuery.data || null,
    isSubscriptionLoading: subscriptionQuery.isLoading,
    subscriptionError: subscriptionQuery.error,

    // خيارات الإدارة
    days,
    setDays,
    isLoading,
    isError,
    refetchAll: () => {
      financialQuery.refetch();
      subscriptionQuery.refetch();
    },
  };
};

