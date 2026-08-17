import React from 'react';
import DoctorsHeader from '../components/DoctorsHeader';
import DoctorsTable from '../components/DoctorsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
import Search from '../../../components/shared/Search/Search';
import { useDoctors } from '../hooks/useDoctors';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DoctorsPage = () => {
  const { t } = useTranslation();
  const {
    doctors,
    pagination,
    isLoading,
    selectedStatus,     
    setSelectedStatus,  
    currentPage,
    setCurrentPage,
    toggleStatus,       
    updatingDoctorId,   
    searchQuery,
    setSearchQuery,
  } = useDoctors();

  const handleToggleStatus = (id, nextStatus) => {
    toggleStatus(id, nextStatus);
  };

  return (
    <div className="flex flex-col gap-5 px-1 sm:px-4 lg:px-2 pb-10 min-h-full font-zain" dir="rtl">
      
      <DoctorsHeader 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus} 
      />

      <div className="w-full shrink-0">
        <Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('doctors.searchPlaceholder') || 'ابحث باسم الطبيب...'}
          width="100%"
          className="w-full"
          onClear={() => setSearchQuery('')}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-6"
      >
        <DoctorsTable 
          doctors={doctors} 
          isLoading={isLoading} 
          onToggleStatus={handleToggleStatus}
          updatingDoctorId={updatingDoctorId} 
          searchQuery={searchQuery}
        />
        
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <MembershipPagination 
              pagination={pagination} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorsPage;