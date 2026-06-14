import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';

export const useDoctors = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctors-list'],
    queryFn: doctorsApi.getDoctors,
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const allDoctors = data?.doctors || [];

  const { searchQuery, setSearchQuery, filteredData: filteredDoctors } = useSearch(
    allDoctors,
    ['name', 'clinicName', 'email', 'phone', 'city', 'country']
  );

  const limit = 6;
  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.ceil(totalDoctors / limit) || 1;

  // Reset page if search results shrink below current page
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredDoctors.slice(start, start + limit);
  }, [filteredDoctors, currentPage, limit]);

  const pagination = useMemo(() => ({
    total: totalDoctors,
    page: currentPage,
    totalPages,
  }), [totalDoctors, currentPage, totalPages]);

  return {
    doctors: paginatedDoctors,
    pagination,
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
  };
};

