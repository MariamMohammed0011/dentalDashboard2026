import React from 'react';
import { ChevronRight } from 'lucide-react';
import MembershipCard from '../../membership/components/MembershipCard';
import { useMembership } from '../../membership/hooks/useMembership';

const PendingRequestsSidebar = () => {
  const { requests, isLoading, handleUpdateStatus } = useMembership();
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="w-[380px] bg-[#E8F1FF]/30 rounded-[2.5rem] p-6 flex flex-col gap-6 border border-white/50 h-full" dir="rtl">
      {/* الهيدر */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-text-muted shadow-sm border border-gray-100">
            <ChevronRight size={24} />
          </div>
          <span className="text-text-muted font-bold text-lg">41</span>
        </div>
        <h2 className="text-primary font-black text-xl">طلبات بانتظار الموافقة</h2>
      </div>

      {/* القائمة القابلة للتمرير */}
      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-1">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="min-h-[135px] bg-white/50 rounded-[1.5rem] animate-pulse" />
          ))
        ) : (
          pendingRequests.map((request) => (
            <div key={request.id} className="transform scale-95 origin-right">
              <MembershipCard 
                request={request} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingRequestsSidebar;
