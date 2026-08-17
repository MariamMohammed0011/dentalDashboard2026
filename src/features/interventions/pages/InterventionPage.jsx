import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import InterventionHeader from '../components/InterventionHeader';
import InterventionTable from '../components/InterventionTable';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useInterventions } from '../hooks/useInterventions';

const InterventionPage = () => {
  const { t } = useTranslation();
  const {
    complaints,
    allCount,
    pagination,
    isLoading,
    isError,
    refetch,
    activeTab,
    handleTabChange,
    statusFilter,
    handleStatusFilterChange,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    selectedComplaint,
    setSelectedComplaint,
    sendReply,
    isReplying
  } = useInterventions();

  return (
    <div className="p-4 sm:p-4 lg:p-4 flex flex-col gap-6 bg-transparent font-zain" dir="rtl">
      {/* Top Header Controls */}
      <InterventionHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={refetch}
        isRefreshing={isLoading}
        totalCount={allCount}
      />

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm font-bold">
          <AlertCircle size={20} className="shrink-0 text-rose-500" />
          <span>{t('common.errorOccurred')}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <InterventionTable
          complaints={complaints}
          isLoading={isLoading}
          onViewDetails={setSelectedComplaint}
        />

        {pagination?.totalPages > 1 && (
          <div className="pt-6 border-t border-border-main/50">
            <MembershipPagination
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>

      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSendReply={sendReply}
          isReplying={isReplying}
        />
      )}
    </div>
  );
};

export default InterventionPage;
