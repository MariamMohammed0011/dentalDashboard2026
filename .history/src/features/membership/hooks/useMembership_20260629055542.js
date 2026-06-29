import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { membershipApi } from '../services/membershipApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus';

export const useMembership = () => {
  // ── حالات التحكم في القائمة والفلترة ──
  const [activeTab, setActiveTab] = useState('doctor'); 
  const [currentPage, setCurrentPage] = useState(1);

  // ── حالة التحكم في المودال (ID المستخدم المختار) ──
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 1. جلب قائمة الطلبات (المختصرة)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['membership-requests', activeTab, currentPage],
    queryFn: () => membershipApi.getMembershipRequests({ type: activeTab, page: currentPage }),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000, 
    refetchIntervalInBackground: true,
  });

  // ── منطق البحث الموحد ──
  const { searchQuery, setSearchQuery, filteredData: filteredRequests } = useSearch(
    data?.data,
    ['name', 'dentistName', 'labName']
  );

  // 2. جلب تفاصيل مستخدم محدد (تُفعل فقط عند فتح المودال)
  const { 
    data: userDetails, 
    isLoading: isLoadingDetails,
    isError: isErrorDetails 
  } = useQuery({
    queryKey: ['user-details', selectedUserId],
    queryFn: () => membershipApi.getUserDetails(selectedUserId),
    enabled: !!selectedUserId, 
    staleTime: 1000 * 60 * 5, 
  });

  // 3. استخدام الهوك الموحد لتحديث الحالة (قبول، رفض، تعليق)
  const { updateStatus, isPending } = useUpdateUserStatus(['membership-requests']);

  // ── دالات المعالجة (Handlers) ──

  const handleUpdateStatus = (id, status, type) => {
    updateStatus({ id, status, type: type || activeTab });
  };

  const handleShowDetails = (request) => {
    setSelectedUserId(request.id);
  };

  const handleCloseDetails = () => {
    setSelectedUserId(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return {
    // بيانات القائمة
    requests: filteredRequests,
    pagination: data?.pagination,
    isLoading,
    isError,
    
    
    userDetails,
    isLoadingDetails,
    isErrorDetails,
    selectedUserId,

    
    activeTab,
    currentPage,
    searchQuery,
    setSearchQuery,
    
    
    handleTabChange,
    handlePageChange: (page) => setCurrentPage(page),
    handleUpdateStatus,
    handleShowDetails,
    handleCloseDetails,
    isUpdating: isPending, 
  };
};