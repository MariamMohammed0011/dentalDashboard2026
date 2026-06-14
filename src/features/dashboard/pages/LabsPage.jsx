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
    <div className="flex flex-col gap-8 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      {/* القسم الرئيسي: قائمة المخابر */}
      <div className="flex-grow flex flex-col pt-0 min-w-0">
        
        {/* الحاوية البيضاء الرئيسية للهيدر والشبكة */}
        <div className="bg-white dark:bg-bg-card rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-white dark:border-slate-800 flex flex-col overflow-hidden">
          
          {/* الهيدر المخصص لصفحة المخابر */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-5 px-4 sm:px-6 bg-[#F8FAFC]/50 dark:bg-slate-800/40 rounded-t-[2rem] border-b border-gray-100/50 dark:border-slate-800 gap-4" dir="rtl">
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

          {/* شبكة البطاقات */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-8 bg-[#F8FAFC]/50 dark:bg-slate-900/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-[220px] bg-white dark:bg-slate-800 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-slate-800/60" />
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
              <div className="mt-10">
                <MembershipPagination 
                  pagination={pagination} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

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

