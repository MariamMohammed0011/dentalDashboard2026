import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi';

export const useDoctors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', currentPage],
    queryFn: () => doctorsApi.getDoctors({ page: currentPage }),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const filteredDoctors = data?.data?.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
