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
    <div className="flex flex-col  lg:flex-row gap-8 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      {/* القسم الأيمن (الرئيسي): قائمة الأطباء */}
      <div className="flex-grow flex flex-col pt-0 min-w-0">
        
        {/* الحاوية البيضاء الرئيسية للهيدر والشبكة */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-white flex flex-col overflow-hidden">
          <DoctorsHeader 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-8 bg-[#F8FAFC]/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-[220px] bg-white rounded-[2rem] animate-pulse border border-gray-100" />
                ))
              ) : (
                doctors.map((doc) => (
                  <DoctorCard key={doc.id} {...doc} />
                ))
              )}
            </div>

            {/* الترقيم */}
            <div className="mt-10">
              <MembershipPagination 
                pagination={pagination} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* القسم الأيسر: طلبات بانتظار الموافقة */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full xl:w-[380px] pt-0 xl:pt-6"
      >
        <PendingRequestsSidebar />
      </motion.div>
    </div>
  );
};

export default DoctorsPage;
