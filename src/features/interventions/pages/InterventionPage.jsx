import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import InterventionHeader from '../components/InterventionHeader';
import InterventionCard from '../components/InterventionCard';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useInterventions } from '../hooks/useInterventions';

const InterventionPage = () => {
  const {
    interventions,
    pagination,
    isLoading,
    activeTab,
    handleTabChange,
    setCurrentPage
  } = useInterventions();

  return (
    <div className="pt-2 sm:pt-4 lg:pt-6 px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:gap-6 bg-transparent" dir="rtl">
      <InterventionHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 lg:p-8 "
      >
        <div className="flex flex-col gap-8 sm:gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[180px] bg-white/50 rounded-[1.5rem] animate-pulse" />
              ))
            ) : (
              interventions.map((item) => (
                <InterventionCard key={item.id} intervention={item} />
              ))
            )}
          </div>

        </div>

        {/* الترقيم */}
        <div className="mt-auto pt-6 border-t border-gray-200/50">
          <MembershipPagination 
            pagination={pagination} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default InterventionPage;
