import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membershipApi } from '../services/membershipApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';
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

  // 3. تحديث حالة طلب الانتساب (قبول، رفض، تعليق)
  // ⚠️ يجب استدعاء membershipApi.updateRequestStatus مباشرةً (وليس هوك حالة الحساب الرقمية
  // useUpdateUserStatus) لأن حالات هذا الطلب (accepted/rejected/suspended) نصوص وليست أرقام،
  // وتذهب لمسار موافقة/رفض/تعليق منفصل تماماً في الباك اند (/AdminAccounts/.../approve|reject|suspend)
  const queryClient = useQueryClient();
  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, status, type, amount }) => membershipApi.updateRequestStatus(id, status, type, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
      toast.success('تم تحديث حالة الطلب بنجاح');
    },
    onError: (e) => {
      console.error(e);
      const errMsg = e?.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الطلب';
      toast.error(errMsg);
    },
  });

  // ── دالات المعالجة (Handlers) ──
  // ترجع Promise عمداً: مودال موافقة المخبر بينتظرها ليعرض الخطأ محلياً ويقفل نفسه بس عند النجاح
  const handleUpdateStatus = (id, status, type, amount) => {
    return updateStatus({ id, status, type: type || activeTab, amount });
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