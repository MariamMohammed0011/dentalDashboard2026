import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '../services/adsApi';

export const useAds = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['ads', currentPage],
    queryFn: () => adsApi.getAds({ page: currentPage }),
    keepPreviousData: true,
  });

  return {
    ads: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    currentPage,
    setCurrentPage,
  };
};
