import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { labsApi } from '../services/labsApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus';

export const useLabs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabId, setSelectedLabId] = useState(null);

  
  const { data: rawLabs = [], isLoading, isError } = useQuery({
    queryKey: ['labs-list'],
    queryFn: labsApi.getLabs,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });

  
  const { updateStatus, isPending, updatingId } = useUpdateUserStatus(['labs-list', 'lab-card-details', 'lab-details']);

  
  const { searchQuery, setSearchQuery, filteredData: filteredLabs } = useSearch(
    rawLabs,
    ['name']
  );

  const limit = 6;
  const totalLabs = filteredLabs.length;
  const totalPages = Math.ceil(totalLabs / limit) || 1;

  
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  
  const paginatedLabs = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredLabs.slice(start, start + limit);
  }, [filteredLabs, currentPage, limit]);

  const pagination = useMemo(() => ({
    total: totalLabs,
    page: currentPage,
    totalPages,
  }), [totalLabs, currentPage, totalPages]);

  
  const { 
    data: labDetails, 
    isLoading: isLoadingDetails,
    isError: isErrorDetails 
  } = useQuery({
    queryKey: ['lab-details', selectedLabId],
    queryFn: () => labsApi.getLabDetails(selectedLabId),
    enabled: !!selectedLabId,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  const handleShowDetails = (id) => {
    setSelectedLabId(id);
  };

  const handleCloseDetails = () => {
    setSelectedLabId(null);
  };

  return {
    labs: paginatedLabs,
    pagination,
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,

    // Details modal state
    selectedLabId,
    labDetails,
    isLoadingDetails,
    isErrorDetails,
    handleShowDetails,
    handleCloseDetails,

    // Status modification
    toggleStatus: ({ id, nextStatus }) => updateStatus({ id, status: nextStatus, type: 'lab' }),
    updatingLabId: updatingId,
  };
};
