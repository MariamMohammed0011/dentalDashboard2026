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
    <div className="h-full flex flex-col" dir="rtl">

      {/* ── الهيدر ثابت (لا يسكرول) ── */}
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <MembershipHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* ── منطقة الكروت (تسكرول وحدها) ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pb-6 custom-scrollbar min-h-0">
        <MembershipList
          requests={requests}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

    </div>
  );
};

export default MembershipRequestsPage;
