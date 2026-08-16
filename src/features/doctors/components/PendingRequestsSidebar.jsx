import React from 'react';
import { ChevronRight } from 'lucide-react';
import MembershipCard from '../../membership/components/MembershipCard';
import { useMembership } from '../../membership/hooks/useMembership';

const PendingRequestsSidebar = () => {
  const { requests, isLoading, handleUpdateStatus } = useMembership();
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <></>
    
  );
};

export default PendingRequestsSidebar;
