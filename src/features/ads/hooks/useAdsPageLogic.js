import { useState } from 'react';
import { useAds } from '../hooks/useAds'; // الهوك الأساسي الخاص بك
import { toast } from 'sonner';

export const useAdsPageLogic = () => {
  const { 
    ads, 
    pagination, 
    isLoading, 
    currentPage, 
    setCurrentPage, 
    filters, 
    setFilters,
    updateAd,
    deleteAd,
    createAd,
    createAdClient,
    isCreatingClient
  } = useAds();

  // Modals visibility state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Data state for specific operations
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [adToApprove, setAdToApprove] = useState(null);

  // Toggle active/inactive status
  const handleToggleStatus = (ad) => {
    const newStatus = ad.status === 'active' ? 'inactive' : 'active';
    updateAd({ 
      id: ad.id, 
      updates: { status: newStatus } 
    });
    toast.success(`تم تغيير حالة الإعلان إلى (${newStatus === 'active' ? 'نشط' : 'غير نشط'})`);
  };

  // Approve advertisement (opens custom price modal)
  const handleApproveAd = (ad) => {
    setAdToApprove(ad);
    setIsApproveModalOpen(true);
  };

  // Confirm approval after setting price
  const handleConfirmApprove = (price) => {
    if (adToApprove) {
      updateAd({ 
        id: adToApprove.id, 
        updates: { 
          approvalStatus: 'approved', 
          status: 'active', 
          userId: adToApprove.userId,
          price: price
        } 
      });
      toast.success('تم قبول الإعلان وإرسال إشعار الدفع إلى الطبيب بنجاح');
      setIsApproveModalOpen(false);
      setAdToApprove(null);
    }
  };

  // Reject advertisement
  const handleRejectAd = (ad) => {
    updateAd({ 
      id: ad.id, 
      updates: { approvalStatus: 'rejected', status: 'inactive' } 
    });
    toast.error('تم رفض الإعلان وإلغاء تفعيله');
  };

  // Click handlers to open modals
  const handleDeleteClick = (id) => {
    setDeleteAdId(id);
    setIsDeleteModalOpen(true);
  };

  const handleViewClick = (ad) => {
    setSelectedAd(ad);
    setIsViewModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (deleteAdId) {
      deleteAd(deleteAdId);
      toast.success('تم حذف الإعلان بنجاح');
      setIsDeleteModalOpen(false);
      setDeleteAdId(null);
    }
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({
      search: '',
      approvalStatus: 'all',
      status: 'all',
      type: 'all'
    });
    setCurrentPage(1);
  };

  // Apply filters handler
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return {
    // Data & API states
    ads,
    pagination,
    isLoading,
    isCreatingClient,
    createAd,
    createAdClient,
    currentPage,
    setCurrentPage,
    filters,
    
    // Modal states
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
    selectedAd,
    adToApprove,
    
    // Actions / Handlers
    handleToggleStatus,
    handleApproveAd,
    handleConfirmApprove,
    handleRejectAd,
    handleDeleteClick,
    handleViewClick,
    handleConfirmDelete,
    handleResetFilters,
    handleApplyFilters
  };
};