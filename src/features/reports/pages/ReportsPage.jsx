import React from 'react';
import ReportsHeader from '../components/ReportsHeader';
import ReportsTable from '../components/ReportsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useReports } from '../hooks/useReports';

const ReportsPage = () => {
  const { reports, pagination, isLoading, setCurrentPage } = useReports();

  return (
    <div className="p-4 sm:p-8 flex  mt-8 flex-col gap-6 bg-transparent" dir="rtl">
      <ReportsHeader />
      
      <ReportsTable reports={reports} isLoading={isLoading} />

      <MembershipPagination 
        pagination={pagination} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};

export default ReportsPage;
