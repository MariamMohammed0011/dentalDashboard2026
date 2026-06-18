import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi';
import { membershipApi } from '../../membership/services/membershipApi'; // 💡 استيراد السيرفس الموجود مسبقاً

export const useDoctors = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 1. جلب قائمة الأطباء
  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctors-list'],
    queryFn: doctorsApi.getDoctors,
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  // 2. 💡 إضافة الـ Mutation لتغيير الحالة بالتكامل مع الـ membershipApi
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      // خريطة التحويل بما يتوافق مع عمل الـ actionMap في الـ API لديكِ
      // الـ API يتوقع 'accepted' ليحولها إلى 'approve'، و 'suspended' ليحولها إلى 'suspend'
      const apiActionStatus = nextStatus === 'Active' ? 'accepted' : 'suspended';
      
      return await membershipApi.updateRequestStatus(id, apiActionStatus, 'doctor');
    },
    onSuccess: () => {
      // تحديث فوري للقائمة بدون انتظار الـ 5 ثواني الخاصة بالـ refetch
      queryClient.invalidateQueries({ queryKey: ['doctors-list'] });
    },
    onError: (error) => {
      console.error("خطأ أثناء تحديث حالة الطبيب:", error);
    }
  });

  const allDoctors = data?.doctors || [];

  // منطق الفلترة
  const filteredDoctors = useMemo(() => {
    if (selectedStatus === 'all') return allDoctors;
    
    return allDoctors.filter((doc) => {
      return doc.status?.toLowerCase() === selectedStatus.toLowerCase();
    });
  }, [allDoctors, selectedStatus]);

  const limit = 6;
  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.ceil(totalDoctors / limit) || 1;

  // إعادة الترقيم للصفحة الأولى إذا تقلصت النتائج
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // تقسيم البيانات المفلترة حسب الصفحة الحالية
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
    // 💡 تصدير دالة التحديث وحالة التحميل لتمريرها للجدول
    toggleStatus: toggleStatusMutation.mutate,
    updatingDoctorId: toggleStatusMutation.isPending ? toggleStatusMutation.variables?.id : null,
  };
};