import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Inbox } from 'lucide-react';
import InterventionHeader from '../components/InterventionHeader';
import InterventionCard from '../components/InterventionCard';
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[200px] bg-bg-card border border-border-main/50 rounded-[1.8rem] animate-pulse" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border-main rounded-[2rem] bg-bg-card">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4 shadow-sm">
              <Inbox size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-black text-text-main">{t('interventions.emptyState.title')}</h3>
            <p className="text-xs text-text-muted max-w-md mt-1 font-medium">
              {t('interventions.emptyState.desc')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {complaints.map((item) => (
              <InterventionCard
                key={item.id}
                complaint={item}
                onViewDetails={setSelectedComplaint}
              />
            ))}
          </div>
        )}

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
