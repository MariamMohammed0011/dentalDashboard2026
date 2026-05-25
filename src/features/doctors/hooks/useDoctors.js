import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';

export const useDoctors = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', currentPage],
    queryFn: () => doctorsApi.getDoctors({ page: currentPage }),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const { searchQuery, setSearchQuery, filteredData: filteredDoctors } = useSearch(
    data?.data,
    ['name']
  );

  return {
    doctors: filteredDoctors,
    pagination: data?.pagination,
    isLoading,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
  };
};
