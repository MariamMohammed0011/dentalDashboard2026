import React from 'react';
import DoctorsHeader from '../components/DoctorsHeader';
import DoctorsTable from '../components/DoctorsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useDoctors } from '../hooks/useDoctors';
import { motion } from 'framer-motion';

const DoctorsPage = () => {
  const {
    doctors,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage
  } = useDoctors();

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      {/* هيدر الصفحة مباشرة على الخلفية */}
      <DoctorsHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      {/* محتوى الجدول والترقيم مباشرة بدون كارد خارجي */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-6"
      >
        {/* عرض الأطباء بجدول احترافي مسطح */}
        <DoctorsTable doctors={doctors} isLoading={isLoading} />

        {/* الترقيم */}
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
