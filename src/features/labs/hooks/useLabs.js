import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { labsApi } from '../services/labsApi';
import { useSearch } from '../../../components/shared/Search/hooks/useSearch';
import { useUpdateUserStatus } from '../../../hooks/useUpdateUserStatus';

export const useLabs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabId, setSelectedLabId] = useState(null);

  // ── Filter States ──
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingSort, setRatingSort] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  
  const { data: rawLabs = [], isLoading, isError } = useQuery({
    queryKey: ['labs-list'],
    queryFn: labsApi.getLabs,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });

  
  const { updateStatus, isPending, updatingId } = useUpdateUserStatus(['labs-list', 'lab-card-details', 'lab-details']);

  // ── Fetch all lab details for filtering ──
  const labIds = useMemo(() => rawLabs.map(lab => lab.id), [rawLabs]);
  
  const labDetailsQueries = useQuery({
    queryKey: ['all-lab-details', labIds],
    queryFn: async () => {
      if (labIds.length === 0) return {};
      const results = await Promise.all(
        labIds.map(async (id) => {
          try {
            const details = await labsApi.getLabDetails(id);
            return { id, details };
          } catch {
            return { id, details: null };
          }
        })
      );
      const map = {};
      results.forEach(({ id, details }) => {
        map[id] = details;
      });
      return map;
    },
    enabled: labIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const allLabDetails = labDetailsQueries.data || {};
  const isLoadingAllDetails = labDetailsQueries.isLoading;

  // ── Extract available materials & services from all lab details ──
  const { availableMaterials, availableServices } = useMemo(() => {
    const materialsSet = new Set();
    const servicesSet = new Set();

    Object.values(allLabDetails).forEach(detail => {
      if (!detail) return;
      if (detail.materials && Array.isArray(detail.materials)) {
        detail.materials.forEach(m => materialsSet.add(m));
      }
      if (detail.specialties && Array.isArray(detail.specialties)) {
        detail.specialties.forEach(s => servicesSet.add(s));
      }
    });

    return {
      availableMaterials: [...materialsSet].sort(),
      availableServices: [...servicesSet].sort(),
    };
  }, [allLabDetails]);

  
  const { searchQuery, setSearchQuery, filteredData: searchFilteredLabs } = useSearch(
    rawLabs,
    ['name']
  );

  // ── Apply all filters ──
  const filteredLabs = useMemo(() => {
    let result = [...searchFilteredLabs];

    // 1. Status filter
    if (statusFilter !== 'all') {
      result = result.filter(lab => {
        const details = allLabDetails[lab.id];
        const labStatus = details?.owner?.status?.toLowerCase() || '';
        return labStatus === statusFilter.toLowerCase();
      });
    }

    // 2. Material filter
    if (materialFilter !== 'all') {
      result = result.filter(lab => {
        const details = allLabDetails[lab.id];
        return details?.materials?.includes(materialFilter);
      });
    }

    // 3. Service filter
    if (serviceFilter !== 'all') {
      result = result.filter(lab => {
        const details = allLabDetails[lab.id];
        return details?.specialties?.includes(serviceFilter);
      });
    }

    // 4. Rating sort
    if (ratingSort !== 'all') {
      result.sort((a, b) => {
        const ratingA = allLabDetails[a.id]?.averageRating || 0;
        const ratingB = allLabDetails[b.id]?.averageRating || 0;
        return ratingSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
      });
    }

    return result;
  }, [searchFilteredLabs, statusFilter, ratingSort, materialFilter, serviceFilter, allLabDetails]);

  // ── Check if any filter is active ──
  const hasActiveFilters = statusFilter !== 'all' || ratingSort !== 'all' || materialFilter !== 'all' || serviceFilter !== 'all';

  // ── Reset all filters ──
  const resetFilters = () => {
    setStatusFilter('all');
    setRatingSort('all');
    setMaterialFilter('all');
    setServiceFilter('all');
  };

  const limit = 6;
  const totalLabs = filteredLabs.length;
  const totalPages = Math.ceil(totalLabs / limit) || 1;

  
  useMemo(() => {
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

  
  const { 
    data: labDetails, 
    isLoading: isLoadingDetails,
    isError: isErrorDetails 
  } = useQuery({
    queryKey: ['lab-details', selectedLabId],
    queryFn: () => labsApi.getLabDetails(selectedLabId),
    enabled: !!selectedLabId,
    staleTime: 1000 * 60 * 5, 
  });

  const handleShowDetails = (id) => {
    setSelectedLabId(id);
  };

  const handleCloseDetails = () => {
    setSelectedLabId(null);
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
    labDetails,
    isLoadingDetails,
    isErrorDetails,
    handleShowDetails,
    handleCloseDetails,
    
    toggleStatus: ({ id, nextStatus }) => updateStatus({ id, status: nextStatus, type: 'lab' }),
    updatingLabId: updatingId,

    // ── Filter exports ──
    statusFilter,
    setStatusFilter,
    ratingSort,
    setRatingSort,
    materialFilter,
    setMaterialFilter,
    serviceFilter,
    setServiceFilter,
    availableMaterials,
    availableServices,
    hasActiveFilters,
    resetFilters,
    isLoadingAllDetails,
  };
};
