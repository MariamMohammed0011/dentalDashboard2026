import React from 'react';
import DoctorsHeader from '../components/DoctorsHeader';
import DoctorsTable from '../components/DoctorsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useDoctors } from '../hooks/useDoctors';
import { motion } from 'framer-motion';

const DoctorsPage = () => {
  // 💡 تم إضافة toggleStatus و updatingDoctorId هنا ليعمل الكود بشكل صحيح
  const {
    doctors,
    pagination,
    isLoading,
    selectedStatus,     
    setSelectedStatus,  
    currentPage,
    setCurrentPage,
    toggleStatus,       // 👈 أضفنا هذا
    updatingDoctorId,   // 👈 أضفنا هذا
  } = useDoctors();

  // دالة وسيطة يتم تمريرها للجدول
  const handleToggleStatus = (id, nextStatus) => {
    toggleStatus({ id, nextStatus });
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      
      {/* تمرير قيم الفلترة المستخرجة بشكل صحيح للهيدر */}
      <DoctorsHeader 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-6"
      >
        <DoctorsTable 
          doctors={doctors} 
          isLoading={isLoading} 
          onToggleStatus={handleToggleStatus}
          updatingDoctorId={updatingDoctorId} // 👈 الآن المتغير معرف ولن يسبب أي خطأ
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