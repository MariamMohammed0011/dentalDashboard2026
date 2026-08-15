import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { labsApi } from '../services/labsApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus.jsx';

export const useLabs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabId, setSelectedLabId] = useState(null);

  // ── Filter States ──
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingSort, setRatingSort] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [scanVisitFilter, setScanVisitFilter] = useState('all');

  // ── Status Modal States ──
  const [selectedLabForStatus, setSelectedLabForStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  // جلب مصفوفة المخابر الكلية
  const { data: rawLabs = [], isLoading, isError } = useQuery({
    queryKey: ['labs-list'],
    queryFn: labsApi.getLabs,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });

  const { updateStatus, isPending, updatingId } = useUpdateUserStatus(['labs-list']);

  // 💡 استخراج تفاصيل المخبر المختار مباشرة من قائمة rawLabs دون الحاجة لـ API ثاني
  const labDetails = useMemo(() => {
    if (!selectedLabId) return null;
    return rawLabs.find((lab) => String(lab.id) === String(selectedLabId)) || null;
  }, [selectedLabId, rawLabs]);

  // ── البحث حسب اسم المكان أو العنوان ──
  const { searchQuery, setSearchQuery, filteredData: searchFilteredLabs } = useSearch(
    rawLabs,
    ['labNamePlace', 'name', 'cityPlace']
  );

  // ── تطبيق الفلاتر والترتيب ──
  const filteredLabs = useMemo(() => {
    let result = [...searchFilteredLabs];

    if (statusFilter !== 'all') {
      result = result.filter(lab => String(lab.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    if (availabilityFilter !== 'all') {
      result = result.filter(lab => {
        const isAvailable = String(lab.availability || '').toLowerCase() === 'available';
        return availabilityFilter === 'available' ? isAvailable : !isAvailable;
      });
    }

    if (scanVisitFilter !== 'all') {
      result = result.filter(lab => (scanVisitFilter === 'yes' ? !!lab.hasScanVisitService : !lab.hasScanVisitService));
    }

    if (ratingSort !== 'all') {
      result.sort((a, b) => {
        const ratingA = Number(a.averageRating || 0);
        const ratingB = Number(b.averageRating || 0);
        return ratingSort === 'desc' || ratingSort === 'high-to-low' ? ratingB - ratingA : ratingA - ratingB;
      });
    }

    return result;
  }, [searchFilteredLabs, statusFilter, ratingSort, availabilityFilter, scanVisitFilter]);

  const hasActiveFilters = statusFilter !== 'all' || ratingSort !== 'all' || availabilityFilter !== 'all' || scanVisitFilter !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setStatusFilter('all');
    setRatingSort('all');
    setAvailabilityFilter('all');
    setScanVisitFilter('all');
    setSearchQuery('');
  };

  const limit = 6;
  const totalLabs = filteredLabs.length;
  const totalPages = Math.ceil(totalLabs / limit) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedLabs = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredLabs.slice(start, start + limit);
  }, [filteredLabs, currentPage, limit]);

  const pagination = useMemo(() => ({
    total: totalLabs,
    page: currentPage,
    totalPages,
  }), [totalLabs, currentPage, totalPages]);

  // دالة فتح وإغلاق التفاصيل
  const handleShowDetails = (id) => {
    if (!id) return;
    setSelectedLabId(id);
  };

  const handleCloseDetails = () => {
    setSelectedLabId(null);
  };

  // معالجة تعديل الحالة
  const openStatusModal = (lab) => {
    setSelectedLabForStatus(lab);
    setTempStatus(lab.status);
  };

  const handleConfirmStatusChange = (newStatusFromModal) => {
    if (!selectedLabForStatus) return;
    const targetLabId = selectedLabForStatus.userId || selectedLabForStatus.id;
    const finalStatus = (newStatusFromModal !== undefined && newStatusFromModal !== null) ? newStatusFromModal : tempStatus;
    
    updateStatus({ id: targetLabId, status: finalStatus, type: 'lab' });
    setSelectedLabForStatus(null);
  };

  return {
    labs: paginatedLabs,
    pagination,
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedLabId,
    labDetails,            // 💡 أصبحت تحتوي على بيانات المخبر المختار مباشرة
    isLoadingDetails: false, // لم نعد ننتظر التحميل عند فتح التفاصيل لأن البيانات موجودة مسبقاً!
    handleShowDetails,
    handleCloseDetails,

    selectedLabForStatus,
    setSelectedLabForStatus,
    tempStatus,
    setTempStatus,
    openStatusModal,
    handleConfirmStatusChange,

    toggleStatus: ({ id, userId, nextStatus }) => updateStatus({ id: userId || id, status: nextStatus, type: 'lab' }),
    updatingLabId: updatingId,

    statusFilter,
    setStatusFilter,
    ratingSort,
    setRatingSort,
    availabilityFilter,
    setAvailabilityFilter,
    scanVisitFilter,
    setScanVisitFilter,
    hasActiveFilters,
    resetFilters,
  };
};