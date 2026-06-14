import React from 'react';
import { motion } from 'framer-motion';
import LabCard from '../components/LabCard';
import LabDetailsModal from '../components/LabDetailsModal';
import { useLabs } from '../hooks/useLabs';
import MembershipPagination from '../../membership/components/MembershipPagination';
import Search from '../../../components/shared/Search/Search';

const LabsPage = () => {
  const {
    labs,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,

    // Modal details state
    labDetails,
    isLoadingDetails,
    selectedLabId,
    handleShowDetails,
    handleCloseDetails,
  } = useLabs();

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      {/* هيدر صفحة المخابر مسطح وشفاف */}
      <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-0 gap-4 w-full" dir="rtl">
        <div className="shrink-0 w-full sm:w-auto text-right">
          <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-700 dark:text-gray-200">
            المخابر المعتمدة
          </h1>  
        </div>
        
        <Search 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="بحث باسم المخبر.."
          width="320px"
          className="w-full sm:w-[320px]"
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* شبكة البطاقات مباشرة على الخلفية */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-6"
      >
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
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 dark:text-slate-500 font-bold">
              لم يتم العثور على أي مخابر مطابقة لعملية البحث.
            </div>
          )}
        </div>

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

      {/* مودال تفاصيل المخبر */}
      <LabDetailsModal 
        lab={labDetails}
        isOpen={!!selectedLabId}
        onClose={handleCloseDetails}
        isLoading={isLoadingDetails}
      />
    </div>
  );
};

export default LabsPage;
