import React from 'react';
import MembershipHeader from '../components/MembershipHeader';
import MembershipList from '../components/MembershipList';
import { useMembership } from '../hooks/useMembership';

const MembershipRequestsPage = () => {
  const {
    requests,
    isLoading,
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    handleUpdateStatus,
  } = useMembership();

  return (
    /*
      h-full + flex flex-col: الصفحة تأخذ كامل ارتفاع الـ content area
      لا تسكرول وحدها — الـ scroll يكون فقط داخل MembershipList
    */
    <div className="flex flex-col gap-8  px-4 sm:px-10 lg:px-12 pb-10  min-h-full" dir="rtl">
      <div className="flex-grow flex flex-col -mt-4 sm:-mt-4 min-w-0 ">
        
        {/* الحاوية البيضاء الرئيسية */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <MembershipHeader
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar min-h-0">
            <MembershipList
              requests={requests}
              isLoading={isLoading}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipRequestsPage;
