import React from 'react';
import DoctorsHeader from '../components/DoctorsHeader';
import DoctorCard from '../components/DoctorCard';
import PendingRequestsSidebar from '../components/PendingRequestsSidebar';
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
    <div className="flex flex-col lg:flex-row gap-8 bg-transparent p-4 sm:p-8" dir="rtl">
      {/* القسم الأيمن (الرئيسي): قائمة الأطباء */}
      <div className="flex-grow flex flex-col gap-6">
        <DoctorsHeader 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#F2F4F7] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 border border-gray-200/50 shadow-inner"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {isLoading ? (
              Array(12).fill(0).map((_, i) => (
                <div key={i} className="h-[250px] bg-white/40 rounded-[2.5rem] animate-pulse" />
              ))
            ) : (
              doctors.map((doc) => (
                <DoctorCard key={doc.id} {...doc} />
              ))
            )}
          </div>

          {/* الترقيم بستايل خرافي */}
          <MembershipPagination 
            pagination={pagination} 
            onPageChange={setCurrentPage} 
          />
        </motion.div>
      </div>

      {/* القسم الأيسر: طلبات بانتظار الموافقة */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden xl:block w-[380px] h-full"
      >
        <PendingRequestsSidebar />
      </motion.div>
    </div>
  );
};

export default DoctorsPage;
