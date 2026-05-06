import React from 'react';
import MembershipCard from './MembershipCard';

const MembershipList = ({ requests, isLoading, onUpdateStatus }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-white/50 rounded-[2rem] border border-border-main" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/30 rounded-[2rem] border border-dashed border-border-main">
        <p className="text-text-muted font-medium">لا توجد طلبات انتساب حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {requests.map((request) => (
        <MembershipCard 
          key={request.id} 
          request={request} 
          onUpdateStatus={onUpdateStatus} 
        />
      ))}
    </div>
  );
};

export default MembershipList;
