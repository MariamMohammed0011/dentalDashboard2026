import React, { useState } from 'react';
import MembershipHeader from '../components/MembershipHeader';
import MembershipList from '../components/MembershipList';
import MembershipDetailsModal from '../components/MembershipDetailsModal';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
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
    
    userDetails,
    isLoadingDetails,
    handleShowDetails,
    handleCloseDetails,
    selectedUserId
  } = useMembership();

  
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    id: null,
    status: null,
    type: null,
    title: '',
    message: '',
    confirmType: 'warning'
  });

  
  const triggerUpdateStatus = (id, status, type) => {
    const configMap = {
      accepted: { title: 'قبول الطلب', message: 'هل أنت متأكد من قبول هذا العضو؟ سيتم تفعيل حسابه فوراً.', type: 'success' },
      rejected: { title: 'رفض الطلب', message: 'هل أنت متأكد من رفض هذا الطلب؟ لن يتمكن العضو من الدخول.', type: 'danger' },
      suspended: { title: 'تعليق الحساب', message: 'هل أنت متأكد من تعليق هذا الحساب مؤقتاً؟', type: 'warning' },
    };

    const config = configMap[status];
    setConfirmConfig({
      isOpen: true,
      id,
      status,
      type,
      title: config.title,
      message: config.message,
      confirmType: config.type
    });
  };

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
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
              onUpdateStatus={triggerUpdateStatus}
              onShowDetails={handleShowDetails} // يستخدم الآن الدالة من الهوك لجلب البيانات
            />
          </div>
        </div>
      </div>

      {/* مودال تفاصيل العضو - البيانات تُجلب الآن من الإيند بوينت المخصصة */}
      <MembershipDetailsModal 
        request={userDetails} // البيانات التفصيلية من السيرفر
        isOpen={!!selectedUserId} // يفتح المودال إذا كان هناك ID مختار
        onClose={handleCloseDetails} // يغلق المودال ويصفر الـ ID في الهوك
        isLoading={isLoadingDetails} // حالة التحميل أثناء طلب البيانات من API المستخدم
      />

      {/* مودال التأكيد على الإجراءات */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={() => {
          handleUpdateStatus(confirmConfig.id, confirmConfig.status, confirmConfig.type);
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.confirmType}
        confirmText="نعم، متأكد"
        cancelText="تراجع"
      />
    </div>
  );
};

export default MembershipRequestsPage;