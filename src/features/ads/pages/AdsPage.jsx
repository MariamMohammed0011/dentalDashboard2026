import React, { useState } from 'react';
import { useAds } from '../hooks/useAds';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Search, 
  RotateCcw, 
  Trash2, 
  Eye, 
  Check, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  X, 
  Building2, 
  Box,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Phone,
  Image as ImageIcon,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import AddAdModal from '../components/AddAdModal';
import AddAdClientModal from '../components/AddAdClientModal';
import AdsFilter from '../components/AdsFilter';
import ViewAdModal from '../components/ViewAdModal';
import AdsList from '../components/AdsList';

const AdsPage = () => {
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

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Preset images and local form state moved to separate AddAdModal component

  // Filter handlers are managed inside the AdsFilter component

  // Toggle active/inactive status
  const handleToggleStatus = (ad) => {
    const newStatus = ad.status === 'active' ? 'inactive' : 'active';
    updateAd({ 
      id: ad.id, 
      updates: { status: newStatus } 
    });
    toast.success(`تم تغيير حالة الإعلان إلى (${newStatus === 'active' ? 'نشط' : 'غير نشط'})`);
  };

  // Approve advertisement
  const handleApproveAd = (ad) => {
    updateAd({ 
      id: ad.id, 
      updates: { approvalStatus: 'approved', status: 'active', userId: ad.userId } 
    });
    toast.success('تمت الموافقة على الإعلان وتفعيله بنجاح');
  };

  // Reject advertisement
  const handleRejectAd = (ad) => {
    updateAd({ 
      id: ad.id, 
      updates: { approvalStatus: 'rejected', status: 'inactive' } 
    });
    toast.error('تم رفض الإعلان وإلغاء تفعيله');
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (deleteAdId) {
      deleteAd(deleteAdId);
      toast.success('تم حذف الإعلان بنجاح');
      setDeleteAdId(null);
    }
  };

  // Create ad action is handled directly in AddAdModal via createAd mutation

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 bg-transparent" dir="rtl">
      
      {/* 1. Header Section (Styled exactly like Ratings Page, but with Blue color scheme) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        {/* Title and Icon Wrapper */}
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
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }} 
        onResetFilters={() => {
          setFilters({
            search: '',
            approvalStatus: 'all',
            status: 'all',
            type: 'all'
          });
          setCurrentPage(1);
        }} 
      />

      {/* 3. Table / Cards View */}
      <AdsList 
        ads={ads} 
        isLoading={isLoading} 
        pagination={pagination} 
        setCurrentPage={setCurrentPage} 
        handleApproveAd={handleApproveAd} 
        handleToggleStatus={handleToggleStatus} 
        handleDeleteClick={(id) => {
          setDeleteAdId(id);
          setIsDeleteModalOpen(true);
        }} 
        handleViewClick={(ad) => {
          setSelectedAd(ad);
          setIsViewModalOpen(true);
        }} 
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
      />

      {/* D. ADD AD CLIENT MODAL */}
      <AddAdClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onCreateClient={createAdClient}
        isSubmitting={isCreatingClient}
      />

      {/* C. DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteAdId(null);
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
