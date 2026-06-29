import React from 'react';
import { ChevronRight } from 'lucide-react';
import MembershipCard from '../../membership/components/MembershipCard';
import { useMembership } from '../../membership/hooks/useMembership';

const PendingRequestsSidebar = () => {
  const { requests, isLoading, handleUpdateStatus } = useMembership();
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="w-full px-4 sm:px-6 pt-0 pb-6 flex flex-col gap-6 h-full" dir="rtl">
    <div className="relative mb-8 group">
      
      <div className="relative bg-white rounded-[2.5rem] p-3 shadow-sm border border-gray-50 flex justify-between items-center transition-all duration-300 hover:shadow-md">
        
        
        <h2 className="text-primary font-bold text-lg pr-4 select-none">
          طلبات بانتظار الموافقة
        </h2>

        
        <div className="flex items-center gap-4 pl-2">
          
          <div className="flex items-center">
            
            <div className="w-9 h-9 rounded-full border-2 border-white bg-primary text-[11px] text-white flex items-center justify-center font-black shadow-sm z-30 ring-1 ring-primary/10">
              +{pendingRequests.length}
            </div>
            
            <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 -mr-4 shadow-sm z-20" />
            <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 -mr-4 shadow-sm z-10" />
          </div>

          
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
            <ChevronRight size={22} className="group-hover:translate-x-[-2px] transition-transform" />
          </div>
        </div>

      </div>
    </div>

      
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
