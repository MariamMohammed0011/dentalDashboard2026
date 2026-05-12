import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '../services/membershipApi';
import { toast } from 'sonner';

export const useMembership = () => {
  const queryClient = useQueryClient();
  
  // 1. يفضل تبديل 'all' بـ 'doctor' كبداية لأن السيرفر يفصل بينهم في الروابط
  const [activeTab, setActiveTab] = useState('doctor'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // جلب الطلبات بناءً على النوع والصفحة
  const { data, isLoading, isError } = useQuery({
    queryKey: ['membership-requests', activeTab, currentPage],
    queryFn: () => membershipApi.getMembershipRequests({ type: activeTab, page: currentPage }),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000, // تحديث تلقائي كل 5 ثوانٍ
    refetchIntervalInBackground: true, // التحديث حتى لو كانت الصفحة في الخلفية
  });

  // 2. تحديث الميوتيشن ليدعم تمرير الـ type (doctor/lab)
  const updateStatusMutation = useMutation({
    // نمرر الـ type هنا لكي يعرف السيرفس أي مسار (dentists/labs) يسلك
    mutationFn: ({ id, status, type }) => membershipApi.updateRequestStatus(id, status, type),
    
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['membership-requests']);
      
      // رسائل نجاح ذكية بناءً على الحالة المرسلة
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

  // 3. تعديل دالة المعالجة لتأخذ الـ type من الكارد مباشرة أو الـ activeTab تلقائياً
  const handleUpdateStatus = (id, status, type) => {
    // نرسل النوع المحدد (doctor أو lab) للسيرفس
    updateStatusMutation.mutate({ id, status, type: type || activeTab });
  };

  // تصفية البيانات (مع مراعاة احتمالية اختلاف مسميات الحقول من الباك إند)
  const filteredRequests = data?.data?.filter(request => {
    const nameToSearch = request.name || request.dentistName || request.labName || "";
    return nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
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
    handlePageChange: (page) => setCurrentPage(page),
    handleUpdateStatus,
    // في الإصدارات الجديدة من React Query نستخدم isPending بدلاً من isLoading للميوتيشن
    isUpdating: updateStatusMutation.isPending, 
  };
};