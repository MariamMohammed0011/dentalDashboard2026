import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus';

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
    toggleStatus: ({ id, nextStatus }) => updateStatus({ id, status: nextStatus, type: 'doctor' }),
    updatingDoctorId: updatingId,
  };
};