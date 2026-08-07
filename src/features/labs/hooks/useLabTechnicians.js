import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { labTechniciansApi } from '../services/labTechniciansApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus.jsx';

export const useLabTechnicians = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // 💡 حالات المودال المخصص لتعديل الحالة
  const [selectedTechForStatus, setSelectedTechForStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  const { data: rawTechnicians = [], isLoading, isError } = useQuery({
    queryKey: ['lab-technicians-list'],
    queryFn: labTechniciansApi.getLabTechnicians,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });

  const { updateStatus, isPending, updatingId } = useUpdateUserStatus(['lab-technicians-list']);

  const techDetails = useMemo(() => {
    if (!selectedTechId) return null;
    return rawTechnicians.find((tech) => String(tech.id) === String(selectedTechId)) || null;
  }, [selectedTechId, rawTechnicians]);

  const { searchQuery, setSearchQuery, filteredData: searchFilteredTechs } = useSearch(
    rawTechnicians,
    ['name', 'email', 'phone', 'namePlace', 'cityPlace']
  );

  const filteredTechnicians = useMemo(() => {
    let result = [...searchFilteredTechs];

    if (statusFilter !== 'all') {
      result = result.filter(tech => String(tech.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    return result;
  }, [searchFilteredTechs, statusFilter]);

  const limit = 6;
  const totalTechs = filteredTechnicians.length;
  const totalPages = Math.ceil(totalTechs / limit) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedTechnicians = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredTechnicians.slice(start, start + limit);
  }, [filteredTechnicians, currentPage, limit]);

  const handleShowDetails = (id) => {
    if (!id) return;
    setSelectedTechId(id);
  };

  const handleCloseDetails = () => {
    setSelectedTechId(null);
  };

  // 💡 دوال التعامل مع مودال تعديل الحالة
  const openStatusModal = (tech) => {
    setSelectedTechForStatus(tech);
    setTempStatus(tech.status);
  };

  const handleConfirmStatusChange = (statusFromModal) => {
    if (!selectedTechForStatus) return;
    
    // 📡 إرسال الـ id الخاص بالمخبري ورقم الحالة للـ API عبر نفس الهوك الموحد
    updateStatus({ 
      id: selectedTechForStatus.id, 
      status: Number(statusFromModal), 
      type: 'doctor' // أو 'lab' حسب المسار المعرف للـ Endpoint لضرب /Users/{id}/status
    });

    setSelectedTechForStatus(null);
  };

  return {
    technicians: paginatedTechnicians,
    pagination: {
      total: totalTechs,
      page: currentPage,
      totalPages,
    },
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedTechId,
    techDetails,
    handleShowDetails,
    handleCloseDetails,
    statusFilter,
    setStatusFilter,
    
    // 💡 تصدير حالات ودوال المودال
    selectedTechForStatus,
    setSelectedTechForStatus,
    tempStatus,
    setTempStatus,
    openStatusModal,
    handleConfirmStatusChange,
    updatingTechId: updatingId,
  };
};