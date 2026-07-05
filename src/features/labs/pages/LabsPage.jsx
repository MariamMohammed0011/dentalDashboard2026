import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LabCard from '../components/LabCard';
import LabDetailsModal from '../components/LabDetailsModal';
import LabsFilter from '../components/LabsFilter';
import UserStatusModal from '../../../components/shared/UserStatusModal';
import { useLabs } from '../hooks/useLabs';
import MembershipPagination from '../../membership/components/MembershipPagination';
import Search from '../../../components/shared/Search/Search';

const LabsPage = () => {
  const { t } = useTranslation();
  const {
    labs,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,

    
    labDetails,
    isLoadingDetails,
    selectedLabId,
    handleShowDetails,
    handleCloseDetails,

    
    toggleStatus,
    updatingLabId,

    // ── Filter props ──
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
  } = useLabs();

  const [selectedLabForStatus, setSelectedLabForStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  
  const handleStatusChange = (labId, nextStatus) => {
    if (!toggleStatus) return;
    toggleStatus({ id: labId, nextStatus });
  };

  
  const openStatusModal = (lab) => {
    setSelectedLabForStatus(lab);
    setTempStatus(lab.status);
  };

  
  const handleConfirmStatusChange = () => {
    if (!selectedLabForStatus) return;
    handleStatusChange(selectedLabForStatus.id, tempStatus);
    setSelectedLabForStatus(null);
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      
      <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-0 gap-4 w-full" dir="rtl">
        <div className="shrink-0 w-full sm:w-auto text-right">
          <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-700 dark:text-gray-200">
            {t('labs.title')}
          </h1>  
        </div>
        
        <Search 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('labs.searchPlaceholder')}
          width="320px"
          className="w-full sm:w-[320px]"
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* ── Filters Section ── */}
      <div className="relative z-20">
        <LabsFilter
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          ratingSort={ratingSort}
          onRatingSortChange={setRatingSort}
          materialFilter={materialFilter}
          onMaterialChange={setMaterialFilter}
          serviceFilter={serviceFilter}
          onServiceChange={setServiceFilter}
          availableMaterials={availableMaterials}
          availableServices={availableServices}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-6 relative z-0"
      >
        {/* Active filters summary */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400"
          >
            <span className="text-emerald-600 dark:text-emerald-400">
              {pagination.total}
            </span>
            <span>{t('labs.filterResult')}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[230px] bg-white/50 dark:bg-slate-800/30 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800/60" />
            ))
          ) : labs.length > 0 ? (
            labs.map((lab) => (
              <LabCard 
                key={lab.id} 
                id={lab.id} 
                name={lab.name} 
                onShowDetails={handleShowDetails} 
                onEditStatus={openStatusModal}
                updatingLabId={updatingLabId}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 dark:text-slate-500 font-bold">
              {hasActiveFilters 
                ? t('labs.noMatchingFilters')
                : t('labs.noMatchingSearch')}
            </div>
          )}
        </div>

        
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <MembershipPagination 
              pagination={pagination} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </motion.div>

      
      <LabDetailsModal 
        lab={labDetails}
        isOpen={!!selectedLabId}
        onClose={handleCloseDetails}
        isLoading={isLoadingDetails}
      />

      
      <UserStatusModal
        isOpen={!!selectedLabForStatus}
        user={selectedLabForStatus}
        type="lab"
        onClose={() => setSelectedLabForStatus(null)}
        tempStatus={tempStatus}
        setTempStatus={setTempStatus}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default LabsPage;
