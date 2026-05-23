import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi } from '../services/adsApi';

export const useAds = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    approvalStatus: 'all',
    status: 'all',
    type: 'all',
    search: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['ads', currentPage, filters],
    queryFn: () => adsApi.getAds({ page: currentPage, limit: 5, filters }),
    placeholderData: (previousData) => previousData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => adsApi.updateAd(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adsApi.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    }
  });

  const createMutation = useMutation({
    mutationFn: (newAd) => adsApi.createAd(newAd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    }
  });

  return {
    ads: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    updateAd: updateMutation.mutate,
    deleteAd: deleteMutation.mutate,
    createAd: createMutation.mutate,
  };
};
