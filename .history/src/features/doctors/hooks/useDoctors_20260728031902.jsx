import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctorsApi.js';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus';
export const useDoctors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selecedStatus, setSelectedStatus] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctors-list'],
    queryFn: doctorsApi.getDoctors,
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const { updateStatus, isPending, updatingId } = useUpdateUserStatus(['doctors-list']);

  const allDoctors = data?.doctors || [];

  const filteredDoctors = useMemo(() => {
    if (selectedStatus === 'all') return allDoctors;

    return allDoctors.filter((doc) => {
      return doc.status?.toLowerCase() === selectedStatus.toLowerCase();
    });
  }, [allDoctors, selectedStatus]);

  const limit = 6;
  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.ceil(totalDoctors / limit) || 1;

  // 🔴 تم تعديل useMemo إلى useEffect لضبط رقم الصفحة عند تجاوز الحد الأقصى
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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
    // داخل useDoctors.js
    toggleStatus: (id, nextStatus) => updateStatus({ id, status: nextStatus, type: 'doctor' }), updatingDoctorId: updatingId,
  };
};