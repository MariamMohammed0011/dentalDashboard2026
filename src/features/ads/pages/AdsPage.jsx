import React from 'react';
import AdsHeader from '../components/AdsHeader';
import AdCard from '../components/AdCard';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useAds } from '../hooks/useAds';
import { motion } from 'framer-motion';

const AdsPage = () => {
  const { ads, pagination, isLoading, setCurrentPage } = useAds();

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 bg-transparent" dir="rtl">
      <AdsHeader />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#F2F4F7] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200/50 flex-grow flex flex-col shadow-inner"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-[100px] bg-white/50 rounded-[1.5rem] animate-pulse" />
            ))
          ) : (
            ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))
          )}
        </div>

        <MembershipPagination 
          pagination={pagination} 
          onPageChange={setCurrentPage} 
        />
      </motion.div>
    </div>
  );
};

export default AdsPage;
