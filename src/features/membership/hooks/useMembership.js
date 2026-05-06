import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '../services/membershipApi';
import { toast } from 'sonner';

/**
 * Custom hook to manage membership requests state and logic
 */
export const useMembership = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch requests
  const { data, isLoading, isError } = useQuery({
    queryKey: ['membership-requests', activeTab, currentPage],
    queryFn: () => membershipApi.getMembershipRequests({ type: activeTab, page: currentPage }),
    keepPreviousData: true,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => membershipApi.updateRequestStatus(id, status),
    onSuccess: (result) => {
      queryClient.invalidateQueries(['membership-requests']);
      const message = result.status === 'accepted' ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب';
      toast.success(message);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الحالة');
    }
  });

  // Derived data (filtering by search query locally for responsiveness)
  const filteredRequests = data?.data?.filter(request => 
    request.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  return {
    requests: filteredRequests,
    pagination: data?.pagination,
    isLoading,
    isError,
    activeTab,
    currentPage,
    searchQuery,
    setSearchQuery,
    handleTabChange,
    handlePageChange,
    handleUpdateStatus,
    isUpdating: updateStatusMutation.isLoading,
  };
};
