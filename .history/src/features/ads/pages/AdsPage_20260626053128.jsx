import React from 'react';
import { Megaphone, Plus, UserPlus } from 'lucide-react';
import { useAdsPageLogic } from '../hooks/useAdsPageLogic'; // استدعاء الهوك الجديد

import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import AddAdModal from '../components/AddAdModal';
import AddAdClientModal from '../components/AddAdClientModal';
import AdsFilter from '../components/AdsFilter';
import ViewAdModal from '../components/ViewAdModal';
import AdsList from '../components/AdsList';
import ApproveAdModal from '../components/ApproveAdModal';
import EditAdModal from '../components/EditAdModal';

const AdsPage = () => {
  // استدعاء كافة الحالات والدوال من الهوك الصافي
  const {
    ads,
    pagination,
    isLoading,
    isCreatingAd,
    isCreatingClient,
    createAd,
    createAdClient,
    setCurrentPage,
    filters,
    isAddModalOpen,
    setIsAddModalOpen,
    isAddClientModalOpen,
    setIsAddClientModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isApproveModalOpen,
    setIsApproveModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedAd,
    adToApprove,
    adToEdit,
    handleToggleStatus,
    handleApproveAd,
    handleConfirmApprove,
    handleRejectAd,
    handleDeleteClick,
    handleViewClick,
    handleConfirmDelete,
    handleEditClick,
    handleConfirmEdit,
    handleResetFilters,
    handleApplyFilters
  } = useAdsPageLogic();

  return (
    <div className="p-2 flex flex-col gap-6 bg-transparent" dir="rtl">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#E8F1FF] text-[#367AFF] rounded-2xl shadow-sm border border-[#D2E4FF]/50 flex items-center justify-center">
            <Megaphone size={28} className="text-[#367AFF]" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">إدارة الإعلانات</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">مراجعة وتفعيل إعلانات المتاجر والمنتجات على المنصة</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto">
          <button
            onClick={() => setIsAddClientModalOpen(true)}
            className="bg-white text-[#367AFF] border border-[#367AFF]/30 hover:bg-[#F0F6FF] rounded-2xl flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <UserPlus size={18} strokeWidth={2.5} />
            إضافة مستخدم إعلانات
          </button>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#367AFF] text-white hover:bg-[#2563EB] shadow-lg shadow-blue-500/10 rounded-2xl flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus size={18} strokeWidth={2.5} />
            إضافة إعلان
          </button>
        </div>
      </div>

      {/* 2. Filters Container */}
      <AdsFilter 
        filters={filters} 
        onApplyFilters={handleApplyFilters} 
        onResetFilters={handleResetFilters} 
      />

      {/* 3. Table / Cards View */}
      <AdsList 
        ads={ads} 
        isLoading={isLoading} 
        pagination={pagination} 
        setCurrentPage={setCurrentPage} 
        handleApproveAd={handleApproveAd} 
        handleToggleStatus={handleToggleStatus} 
        handleDeleteClick={handleDeleteClick} 
        handleViewClick={handleViewClick} 
        handleEditClick={handleEditClick}
      />

      {/* ====================================================== */}
      {/* MODALS SECTION */}
      {/* ====================================================== */}

      {/* A. VIEW/PREVIEW AD DETAILS MODAL */}
      <ViewAdModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        selectedAd={selectedAd} 
        handleApproveAd={handleApproveAd} 
        handleRejectAd={handleRejectAd} 
      />

      {/* B. ADD ADVERTISEMENT MODAL */}
      <AddAdModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onCreateAd={createAd} 
        isSubmitting={isCreatingAd}
      />

      {/* D. ADD AD CLIENT MODAL */}
      <AddAdClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onCreateClient={createAdClient}
        isSubmitting={isCreatingClient}
      />

      {/* F. EDIT ADVERTISEMENT MODAL */}
      <EditAdModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ad={adToEdit}
        onUpdateAd={handleConfirmEdit}
      />

      {/* E. APPROVE & SET PRICE MODAL */}
      <ApproveAdModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        ad={adToApprove}
        onConfirm={handleConfirmApprove}
      />

      {/* C. DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        title="حذف الإعلان"
        message="هل أنت متأكد من رغبتك في حذف هذا الإعلان بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء لاحقاً."
        confirmText="حذف نهائي"
        cancelText="إلغاء"
        type="danger"
      />

    </div>
  );
};

export default AdsPage;