import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interventionsApi } from '../services/interventionsApi';
import { toast } from 'sonner';

export const useInterventions = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'admin', 'lab'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'replied'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const itemsPerPage = 8;
  const {
    data: allComplaints = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['complaints', activeTab],
    queryFn: () => interventionsApi.getComplaintsByType(activeTab),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  const filteredComplaints = allComplaints.filter(item => {
    const isReplied = Boolean(item.reply || item.repliedAtUtc);
    if (statusFilter === 'replied' && !isReplied) return false;
    if (statusFilter === 'pending' && isReplied) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = String(item.title || '').toLowerCase().includes(q);
      const textMatch = String(item.text || '').toLowerCase().includes(q);
      const userNameMatch = String(item.user?.name || '').toLowerCase().includes(q);
      const clinicNameMatch = String(item.user?.namePlace || '').toLowerCase().includes(q);
      const labNameMatch = String(item.targetLab?.description || '').toLowerCase().includes(q);
      return titleMatch || textMatch || userNameMatch || clinicNameMatch || labNameMatch;
    }

    return true;
  });

  const totalItems = filteredComplaints.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const pagination = {
    total: totalItems,
    page: currentPage,
    totalPages: totalPages,
  };

  const replyMutation = useMutation({
    mutationFn: ({ userId, complaintId, replyText }) =>
      interventionsApi.replyToComplaint(userId, complaintId, replyText),
    onSuccess: (data, variables) => {
      toast.success(data?.message || 'تم إرسال الرد بنجاح وتحديث الشكوى وإرسال الإشعار للطبيب');
      queryClient.invalidateQueries(['complaints']);
      if (selectedComplaint && selectedComplaint.id === variables.complaintId) {
        setSelectedComplaint(prev => ({
          ...prev,
          reply: variables.replyText,
          repliedAtUtc: new Date().toISOString(),
          repliedBy: 'الإدارة'
        }));
      }
    },
    onError: (err) => {
      const errorMsg = err?.response?.data?.message || err?.message || 'حدث خطأ أثناء إرسال الرد على الشكوى';
      toast.error(errorMsg);
    }
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  return {
    complaints: paginatedComplaints,
    allCount: allComplaints.length,
    filteredCount: filteredComplaints.length,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    activeTab,
    handleTabChange,
    statusFilter,
    handleStatusFilterChange,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedComplaint,
    setSelectedComplaint,
    sendReply: replyMutation.mutateAsync,
    isReplying: replyMutation.isPending,
  };
};
