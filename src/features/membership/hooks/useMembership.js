import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '../services/membershipApi';
import { toast } from 'sonner';

export const useMembership = () => {
  const queryClient = useQueryClient();
  
  // ── حالات التحكم في القائمة والفلترة ──
  const [activeTab, setActiveTab] = useState('doctor'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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

  // 2. جلب تفاصيل مستخدم محدد (تُفعل فقط عند فتح المودال)
  const { 
    data: userDetails, 
    isLoading: isLoadingDetails,
    isError: isErrorDetails 
  } = useQuery({
    queryKey: ['user-details', selectedUserId],
    queryFn: () => membershipApi.getUserDetails(selectedUserId),
    enabled: !!selectedUserId, // الجلب يعمل فقط إذا كان selectedUserId يمتلك قيمة
    staleTime: 1000 * 60 * 5, // الاحتفاظ بالبيانات طازجة لمدة 5 دقائق
  });

  // 3. ميوتيشن تحديث الحالة (قبول، رفض، تعليق)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, type }) => membershipApi.updateRequestStatus(id, status, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['membership-requests']);
      const successMessages = {
        accepted: 'تم قبول الطلب بنجاح',
        rejected: 'تم رفض الطلب بنجاح',
        suspended: 'تم تعليق الحساب بنجاح'
      };
      toast.success(successMessages[variables.status] || 'تم تحديث الحالة');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة';
      toast.error(errorMsg);
    }
  });

  // ── دالات المعالجة (Handlers) ──

  const handleUpdateStatus = (id, status, type) => {
    updateStatusMutation.mutate({ id, status, type: type || activeTab });
  };

  const handleShowDetails = (request) => {
    // نعتمد على الـ ID القادم من الكارد لفتح المودال وجلب بياناته
    setSelectedUserId(request.id);
  };

  const handleCloseDetails = () => {
    setSelectedUserId(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // تصفية البيانات المحلية بناءً على البحث
  const filteredRequests = data?.data?.filter(request => {
    const nameToSearch = request.name || request.dentistName || request.labName || "";
    return nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return {
    // بيانات القائمة
    requests: filteredRequests,
    pagination: data?.pagination,
    isLoading,
    isError,
    
    // بيانات التفاصيل (المودال)
    userDetails,
    isLoadingDetails,
    isErrorDetails,
    selectedUserId,

    // التحكم والحالات
    activeTab,
    currentPage,
    searchQuery,
    setSearchQuery,
    
    // الوظائف
    handleTabChange,
    handlePageChange: (page) => setCurrentPage(page),
    handleUpdateStatus,
    handleShowDetails,
    handleCloseDetails,
    isUpdating: updateStatusMutation.isPending, 
  };
};