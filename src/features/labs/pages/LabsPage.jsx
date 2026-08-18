
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LabCard from '../components/LabCard';

import LabsFilter from '../components/LabsFilter';
import UserStatusModal from '../../../components/shared/UserStatusModal';
import { useLabs } from '../hooks/useLabs';
import MembershipPagination from '../../membership/components/MembershipPagination';
import Search from '../../../components/shared/Search/Search';
import LabProfileDetailsModal from '../components/LabProfileDetailsModal';
import { FlaskConical } from 'lucide-react';

const LabsPage = () => {
  const { t } = useTranslation();
  const {
    labs,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    setCurrentPage,

    labDetails,
    isLoadingDetails,
    selectedLabId,
    handleShowDetails,
    handleCloseDetails,

    selectedLabForStatus,
    setSelectedLabForStatus,
    tempStatus,
    setTempStatus,
    openStatusModal,
    handleConfirmStatusChange,

    updatingLabId,

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
  } = useLabs();

  return (
    <div className="flex flex-col gap-6 px-2 sm:px-8 lg:px-2 pb-10 min-h-full" dir="rtl">

      <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-0 gap-4 w-full" dir="rtl">
        {/* <h1 className="text-2xl sm:text-3xl font-medium text-text-main  flex items-center gap-2">
          < size={20} className="text-emerald-600 dark:text-emerald-400" />
         
        </h1> */}
        <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 shadow-sm shrink-0">
           
                    
                    
                    <FlaskConical size={20}  />
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
                      {t('labs.title')}
                    </h1>
                    
                  </div>
                </div>

        {/* <Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('labs.searchPlaceholder')}

          className="w-[80px] "
          onClear={() => setSearchQuery('')}
        /> */}
      </div>

      {/* قسم الفلترة */}
      <div className="relative z-20 mb-6">
        <LabsFilter
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          ratingSort={ratingSort}
          onRatingSortChange={setRatingSort}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
          scanVisitFilter={scanVisitFilter}
          onScanVisitChange={setScanVisitFilter}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-6 relative z-0"
      >
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
              <div key={i} className="h-[170px] bg-white/50 dark:bg-slate-800/30 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800/60" />
            ))
          ) : labs.length > 0 ? (
            labs.map((lab) => (
              <LabCard
                key={lab.id}
                id={lab.id}
                name={lab.labNamePlace || lab.name || '—'}
                averageRating={lab.averageRating}
                availability={lab.availability}
                subscriptionEndUtc={lab.subscriptionEndUtc}
                onShowDetails={handleShowDetails}
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

      <LabProfileDetailsModal
        lab={labDetails} // البيانات المجلوبة من الـ API بحسب المحدّد
        isOpen={!!selectedLabId}
        onClose={handleCloseDetails}
        isLoading={isLoadingDetails}
      />
      {/* مودال تعديل الحالة */}
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