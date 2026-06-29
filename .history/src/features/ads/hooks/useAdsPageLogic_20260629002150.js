import { useState } from 'react';
import { useAds } from '../hooks/useAds'; 
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
    isCreatingAd,
    createAdClient,
    isCreatingClient
  } = useAds();

  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [adToApprove, setAdToApprove] = useState(null);
  const [adToEdit, setAdToEdit] = useState(null);

  const handleToggleStatus = (ad) => {
    const newStatus = ad.status === 'active' ? 'inactive' : 'active';
    updateAd({ 
      id: ad.id, 
      updates: { status: newStatus } 
    });
    toast.success(`تم تغيير حالة الإعلان إلى (${newStatus === 'active' ? 'نشط' : 'غير نشط'})`);
  };

 
  const handleApproveAd = (ad) => {
    setAdToApprove(ad);
    setIsApproveModalOpen(true);
  };

  
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

  const handleEditClick = (ad) => {
    setAdToEdit(ad);
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = (updatedData) => {
    if (adToEdit) {
      updateAd({ 
        id: adToEdit.id, 
        updates: updatedData 
      });
      toast.success('تم تعديل الإعلان بنجاح');
      setIsEditModalOpen(false);
      setAdToEdit(null);
    }
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

  
  const handleResetFilters = () => {
    setFilters({
      search: '',
      approvalStatus: 'all',
      status: 'all',
      type: 'all'
    });
    setCurrentPage(1);
  };

  
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return {
    
    ads,
    pagination,
    isLoading,
    isCreatingAd,
    isCreatingClient,
    createAd,
    createAdClient,
    currentPage,
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
    
    // Actions / Handlers
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
  };
};