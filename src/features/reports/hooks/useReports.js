import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reportsApi';

export const useReports = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', currentPage],
    queryFn: () => reportsApi.getReports({ page: currentPage }),
    keepPreviousData: true,
  });

  return {
    reports: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    currentPage,
    setCurrentPage,
  };
};
