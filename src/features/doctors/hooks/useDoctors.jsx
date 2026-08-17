import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';

export const useDoctors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctors-list'],
    queryFn: doctorsApi.getDoctors,
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const { updateStatus, isPending, updatingId } = useUpdateUserStatus(['doctors-list']);

  const allDoctors = data?.doctors || [];

  const { searchQuery, setSearchQuery, filteredData: searchFilteredDoctors } = useSearch(
    allDoctors,
    ['name']
  );

  const filteredDoctors = useMemo(() => {
    let result = searchFilteredDoctors;

    if (selectedStatus !== 'all') {
      result = result.filter((doc) => {
        return String(doc.status || '').toLowerCase() === selectedStatus.toLowerCase();
      });
    }

    return result;
  }, [searchFilteredDoctors, selectedStatus]);

  const limit = 6;
  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.ceil(totalDoctors / limit) || 1;

  useEffect(() => {
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
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    toggleStatus: (id, nextStatus) => updateStatus({ id, status: nextStatus, type: 'doctor' }),
    updatingDoctorId: updatingId,
  };
};