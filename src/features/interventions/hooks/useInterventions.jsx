import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { interventionsApi } from '../services/interventionsApi';

export const useInterventions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['interventions', activeTab, currentPage],
    queryFn: () => interventionsApi.getInterventions({ type: activeTab, page: currentPage }),
    keepPreviousData: true,
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return {
    interventions: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    activeTab,
    handleTabChange,
    currentPage,
    setCurrentPage,
  };
};
