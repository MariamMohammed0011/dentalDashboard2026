import React from 'react';
import MembershipHeader from '../components/MembershipHeader';
import MembershipList from '../components/MembershipList';
import MembershipPagination from '../components/MembershipPagination';
import { useMembership } from '../hooks/useMembership';

const MembershipRequestsPage = () => {
  const {
    requests,
    pagination,
    isLoading,
    activeTab,
    handleTabChange,
    currentPage,
    handlePageChange,
    searchQuery,
    setSearchQuery,
    handleUpdateStatus
  } = useMembership();

  return (
    <div className="p-4 md:p-8 min-h-screen bg-transparent animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto">
        {/* هيدر الصفحة والفلترة */}
        <MembershipHeader 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* قائمة الطلبات (شبكة البطاقات) */}
        <MembershipList 
          requests={requests} 
          isLoading={isLoading} 
          onUpdateStatus={handleUpdateStatus}
        />

        {/* الترقيم */}
        <MembershipPagination 
          pagination={pagination} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default MembershipRequestsPage;
