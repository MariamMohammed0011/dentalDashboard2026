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
    <div className="p-4 sm:p-6 lg:p-8 flex   mt-8 flex-col gap-8 bg-transparent" dir="rtl">
      <InterventionHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F2F4F7] rounded-[2rem] lg:rounded-[2.5rem] p-4 sm:p-8 border border-gray-200/50 shadow-inner"
      >
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
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

          {/* زر إنشاء طلب يدوي */}
          <div className="flex justify-center mt-12 mb-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-700 text-white px-12 py-3 rounded-2xl font-black shadow-lg shadow-blue-700/30 flex items-center gap-2 hover:bg-blue-800 transition-all text-lg"
            >
              انشاء طلب يدوي
            </motion.button>
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
