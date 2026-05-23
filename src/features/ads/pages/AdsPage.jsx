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
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

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
    createAd
  } = useAds();

  // Local state for filters inputs
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [approvalStatusFilter, setApprovalStatusFilter] = useState(filters.approvalStatus);
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [typeFilter, setTypeFilter] = useState(filters.type);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state for adding new Ad
  const [newAdForm, setNewAdForm] = useState({
    storeName: '',
    storePhone: '',
    type: 'store',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  });

  // Sample preset images for new ads
  const presetImages = [
    { name: 'عيادة حديثة', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' },
    { name: 'كرسي أسنان متطور', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80' },
    { name: 'أدوات ومعدات طبية', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80' },
    { name: 'مخبر تعويضات سنية', url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80' },
    { name: 'عناية بالأسنان', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80' }
  ];

  // Apply filters handler
  const handleApplyFilters = () => {
    setFilters({
      search: searchQuery,
      approvalStatus: approvalStatusFilter,
      status: statusFilter,
      type: typeFilter
    });
    setCurrentPage(1);
    toast.success('تم تطبيق الفلاتر بنجاح');
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setApprovalStatusFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setFilters({
      search: '',
      approvalStatus: 'all',
      status: 'all',
      type: 'all'
    });
    setCurrentPage(1);
    toast.info('تم إعادة تعيين الفلاتر');
  };

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
      updates: { approvalStatus: 'approved', status: 'active' } 
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

  // Create new Ad handler
  const handleCreateAd = (e) => {
    e.preventDefault();
    if (!newAdForm.storeName || !newAdForm.storePhone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    createAd(newAdForm);
    toast.success('تمت إضافة الإعلان الجديد بنجاح');
    setIsAddModalOpen(false);
    setNewAdForm({
      storeName: '',
      storePhone: '',
      type: 'store',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      status: 'active'
    });
  };

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

        {/* Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#367AFF] text-white hover:bg-[#2563EB] shadow-lg shadow-blue-500/10 rounded-2xl flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Plus size={18} strokeWidth={2.5} />
          إضافة إعلان
        </button>
      </div>

      {/* 2. Filters Container */}
      <div className="bg-white rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          
          {/* Approval Status Filter */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">حالة التأكيد</label>
            <select
              value={approvalStatusFilter}
              onChange={(e) => setApprovalStatusFilter(e.target.value)}
              className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:left_1rem_center] bg-no-repeat pl-10"
            >
              <option value="all">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="approved">تمت الموافقة</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:left_1rem_center] bg-no-repeat pl-10"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">النوع</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:left_1rem_center] bg-no-repeat pl-10"
            >
              <option value="all">كل الأنواع</option>
              <option value="store">متجر</option>
              <option value="product">منتج</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">البحث</label>
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في الإعلانات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full pr-10"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

        </div>

        {/* Buttons (Apply & Reset) */}
        <div className="flex flex-row gap-3 justify-start mt-2">
          <button
            onClick={handleApplyFilters}
            className="bg-[#367AFF] text-white hover:bg-[#2563EB] shadow-md shadow-blue-500/10 px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Search size={16} />
            بحث
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <RotateCcw size={16} />
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* 3. Table / Cards View */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex-grow flex flex-col">
        
        {/* Large/Medium Screen Table */}
        <div className="hidden lg:block overflow-x-auto custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-0 text-center">
            <thead>
              <tr className="bg-[#E8F1FF] text-[#1E40AF] font-black text-[14px]">
                <th className="py-4.5 px-6 rounded-r-3xl">ID</th>
                <th className="py-4.5 px-4">النوع</th>
                <th className="py-4.5 px-6 text-right">المتجر</th>
                <th className="py-4.5 px-4">حالة التأكيد</th>
                <th className="py-4.5 px-4">الحالة</th>
                <th className="py-4.5 px-6 rounded-l-3xl">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="py-5 px-6 border-b border-gray-50">
                      <div className="h-10 bg-gray-50 rounded-2xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-400 font-bold">
                    <Megaphone size={48} className="mx-auto mb-3 text-gray-300 opacity-80" />
                    لا توجد إعلانات مطابقة لخيارات البحث الحالية
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="bg-white hover:bg-blue-50/5 transition-colors group">
                    
                    {/* ID */}
                    <td className="py-5 px-6 border-b border-gray-50 text-gray-700 font-extrabold text-[15px]">
                      #{ad.id}
                    </td>
                    
                    {/* النوع */}
                    <td className="py-5 px-4 border-b border-gray-50">
                      {ad.type === 'product' ? (
                        <div className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-100/50 px-3.5 py-1 rounded-full text-xs font-bold">
                          <Box size={14} className="text-amber-500" />
                          <span>منتج</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-sky-600 bg-sky-50 border border-sky-100/50 px-3.5 py-1 rounded-full text-xs font-bold">
                          <Building2 size={14} className="text-sky-500" />
                          <span>متجر</span>
                        </div>
                      )}
                    </td>

                    {/* المتجر */}
                    <td className="py-5 px-6 border-b border-gray-50 text-right">
                      <div className="flex items-center gap-3 justify-start">
                        <img 
                          src={ad.storeAvatar} 
                          alt={ad.storeName} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                        <div className="text-right flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">{ad.storeName}</span>
                          <span className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">{ad.storePhone}</span>
                        </div>
                      </div>
                    </td>

                    {/* حالة التأكيد */}
                    <td className="py-5 px-4 border-b border-gray-50">
                      {ad.approvalStatus === 'pending' && (
                        <div className="inline-flex items-center gap-1.5 text-amber-500 bg-[#FFFDF5] border border-amber-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold">
                          <Clock size={13} className="text-amber-500 animate-pulse" />
                          <span>قيد الانتظار</span>
                        </div>
                      )}
                      {ad.approvalStatus === 'approved' && (
                        <div className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold">
                          <CheckCircle2 size={13} className="text-blue-500" />
                          <span>تمت الموافقة</span>
                        </div>
                      )}
                      {ad.approvalStatus === 'rejected' && (
                        <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 border border-rose-100/50 px-3.5 py-1.5 rounded-full text-xs font-bold">
                          <AlertCircle size={13} className="text-rose-500" />
                          <span>مرفوض</span>
                        </div>
                      )}
                    </td>

                    {/* الحالة */}
                    <td className="py-5 px-4 border-b border-gray-50">
                      {ad.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50/50 border border-blue-100/30 px-3 py-1 rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-50/50 border border-rose-100/30 px-3 py-1 rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                          غير نشط
                        </span>
                      )}
                    </td>

                    {/* العمليات */}
                    <td className="py-5 px-6 border-b border-gray-50">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* Approval button (Check) */}
                        <button
                          onClick={() => handleApproveAd(ad)}
                          disabled={ad.approvalStatus === 'approved'}
                          className={`p-2 rounded-xl border transition-all active:scale-95 ${
                            ad.approvalStatus === 'approved'
                              ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-blue-50 border-blue-100 text-[#367AFF] hover:bg-[#367AFF] hover:text-white hover:shadow-md hover:shadow-blue-500/10'
                          }`}
                          title="الموافقة على الإعلان"
                        >
                          <Check size={16} strokeWidth={2.5} />
                        </button>

                        {/* Status Toggle Switch */}
                        <div className="flex items-center h-full px-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={ad.status === 'active'} 
                              onChange={() => handleToggleStatus(ad)} 
                              className="sr-only peer" 
                            />
                            <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#367AFF]"></div>
                          </label>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setDeleteAdId(ad.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-[#E11D48] hover:text-white hover:shadow-md hover:shadow-rose-500/10 transition-all active:scale-95"
                          title="حذف الإعلان"
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedAd(ad);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white hover:shadow-md transition-all active:scale-95"
                          title="عرض تفاصيل الإعلان"
                        >
                          <Eye size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Small Screen Layout (Modern Cards Grid) */}
        <div className="block lg:hidden p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-50 p-5 rounded-3xl animate-pulse h-[160px]" />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-bold">
              <Megaphone size={48} className="mx-auto mb-3 text-gray-300 opacity-80" />
              لا توجد إعلانات مطابقة لخيارات البحث
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div 
                  key={ad.id} 
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Top Bar: ID and Action Buttons */}
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-sm font-extrabold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl">#{ad.id}</span>
                    
                    <div className="flex items-center gap-1.5">
                      {/* View */}
                      <button 
                        onClick={() => {
                          setSelectedAd(ad);
                          setIsViewModalOpen(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 border border-gray-100"
                        title="عرض"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Approve */}
                      <button 
                        onClick={() => handleApproveAd(ad)}
                        disabled={ad.approvalStatus === 'approved'}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl border ${
                          ad.approvalStatus === 'approved'
                            ? 'bg-gray-50 text-gray-300 border-gray-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                        title="موافقة"
                      >
                        <Check size={14} strokeWidth={2.5} />
                      </button>

                      {/* Delete */}
                      <button 
                        onClick={() => {
                          setDeleteAdId(ad.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex gap-3 justify-start items-center">
                    <img 
                      src={ad.storeAvatar} 
                      alt={ad.storeName} 
                      className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                    <div className="text-right flex flex-col flex-grow">
                      <span className="font-extrabold text-gray-800 text-sm">{ad.storeName}</span>
                      <span className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">{ad.storePhone}</span>
                    </div>
                    <div>
                      {ad.type === 'product' ? (
                        <div className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100/50 px-3 py-1 rounded-full text-xs font-bold">
                          <Box size={12} />
                          <span>منتج</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-sky-600 bg-sky-50 border border-sky-100/50 px-3 py-1 rounded-full text-xs font-bold">
                          <Building2 size={12} />
                          <span>متجر</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Status Indicators */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">تفعيل الحساب</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={ad.status === 'active'} 
                          onChange={() => handleToggleStatus(ad)} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:start-[2.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#367AFF]"></div>
                      </label>
                    </div>

                    <div>
                      {ad.approvalStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-500 bg-[#FFFDF5] border border-amber-100/30 px-3 py-1 rounded-full text-xs font-bold">
                          <Clock size={11} className="animate-pulse" />
                          قيد الانتظار
                        </span>
                      )}
                      {ad.approvalStatus === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100/30 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle2 size={11} />
                          الموافقة
                        </span>
                      )}
                      {ad.approvalStatus === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-100/30 px-3 py-1 rounded-full text-xs font-bold">
                          <AlertCircle size={11} />
                          مرفوض
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Table Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center p-5 border-t border-gray-100 bg-gray-50/50 mt-auto">
            <div className="text-xs sm:text-sm text-gray-500 font-bold">
              صفحة {pagination.page} من {pagination.totalPages} (الإجمالي {pagination.total} إعلان)
            </div>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setCurrentPage(pagination.page - 1)}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
              <button 
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setCurrentPage(pagination.page + 1)}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ====================================================== */}
      {/* MODALS SECTION */}
      {/* ====================================================== */}

      {/* A. VIEW/PREVIEW AD DETAILS MODAL */}
      <AnimatePresence>
        {isViewModalOpen && selectedAd && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 left-4 z-10 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* Advertisement Image Header */}
              <div className="h-48 sm:h-72 w-full relative bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  src={selectedAd.image} 
                  alt="Advertisement Banner" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex items-end p-6">
                  <div className="flex items-center gap-3 text-white">
                    <img 
                      src={selectedAd.storeAvatar} 
                      alt={selectedAd.storeName} 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-xl flex-shrink-0"
                    />
                    <div className="text-right">
                      <h3 className="text-base sm:text-xl font-black">{selectedAd.storeName}</h3>
                      <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
                        <Phone size={12} />
                        <span dir="ltr">{selectedAd.storePhone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5 sm:p-7 flex flex-col gap-5 text-right overflow-y-auto flex-grow custom-scrollbar">
                
                {/* Meta details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-bold">رقم الإعلان المعرف</span>
                    <span className="text-sm font-extrabold text-gray-700">#{selectedAd.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-bold">نوع الإعلان</span>
                    <span className="text-sm font-extrabold text-[#367AFF]">
                      {selectedAd.type === 'product' ? 'منتج معروض' : 'ترويج للمتجر'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-bold">حالة التفعيل</span>
                    <span className="text-sm font-extrabold">
                      {selectedAd.status === 'active' ? (
                        <span className="text-blue-600">نشط حالياً</span>
                      ) : (
                        <span className="text-rose-500">غير نشط</span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-bold">حالة المراجعة والتأكيد</span>
                    <div>
                      {selectedAd.approvalStatus === 'pending' && <span className="text-amber-500 font-bold text-sm">قيد المراجعة</span>}
                      {selectedAd.approvalStatus === 'approved' && <span className="text-blue-600 font-bold text-sm">مقبول وموافق عليه</span>}
                      {selectedAd.approvalStatus === 'rejected' && <span className="text-rose-500 font-bold text-sm">مرفوض</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer inside view modal */}
              <div className="flex gap-3 justify-end items-center p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100 flex-shrink-0">
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-200 text-gray-500 font-bold text-sm sm:text-base rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إغلاق المعاينة
                </button>
                
                {selectedAd.approvalStatus === 'pending' && (
                  <>
                    <button 
                      onClick={() => {
                        handleRejectAd(selectedAd);
                        setIsViewModalOpen(false);
                      }}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 bg-rose-50 text-rose-600 border border-rose-100 font-bold text-sm sm:text-base rounded-2xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                    >
                      رفض الإعلان
                    </button>
                    <button 
                      onClick={() => {
                        handleApproveAd(selectedAd);
                        setIsViewModalOpen(false);
                      }}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#367AFF] text-white font-bold text-sm sm:text-base rounded-2xl hover:bg-[#2563EB] shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                    >
                      قبول الإعلان
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. ADD ADVERTISEMENT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
            >
              
              {/* Header */}
              <div className="bg-[#E8F1FF] p-5 sm:p-6 text-right flex items-center justify-between border-b border-[#D2E4FF]/50 flex-shrink-0">
                <div className="flex items-center gap-3 text-[#367AFF]">
                  <Megaphone size={22} strokeWidth={2.5} />
                  <h3 className="text-lg font-black">إضافة إعلان جديد</h3>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 hover:bg-white/50 rounded-xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateAd} className="flex flex-col flex-grow overflow-hidden">
                
                {/* Scrollable form body */}
                <div className="p-5 sm:p-7 flex flex-col gap-4 text-right overflow-y-auto flex-grow custom-scrollbar">
                  
                  {/* Store Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">اسم المتجر / الدكتور</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عيادة د. أحمد"
                      value={newAdForm.storeName}
                      onChange={(e) => setNewAdForm({ ...newAdForm, storeName: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">رقم الهاتف</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: +963 981 053 230"
                      value={newAdForm.storePhone}
                      onChange={(e) => setNewAdForm({ ...newAdForm, storePhone: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right"
                      dir="ltr"
                    />
                  </div>

                  {/* Type & Active Status side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">نوع الإعلان</label>
                      <select
                        value={newAdForm.type}
                        onChange={(e) => setNewAdForm({ ...newAdForm, type: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                      >
                        <option value="store">متجر</option>
                        <option value="product">منتج</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">الحالة البدئية</label>
                      <select
                        value={newAdForm.status}
                        onChange={(e) => setNewAdForm({ ...newAdForm, status: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                      >
                        <option value="active">نشط ومفعل</option>
                        <option value="inactive">غير نشط</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Selection presets */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">اختر صورة توضيحية للإعلان</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {presetImages.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewAdForm({ ...newAdForm, image: img.url })}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            newAdForm.image === img.url 
                              ? 'border-[#367AFF] scale-95 shadow-md shadow-blue-500/10' 
                              : 'border-transparent hover:scale-105'
                          }`}
                          title={img.name}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          {newAdForm.image === img.url && (
                            <div className="absolute inset-0 bg-[#367AFF]/20 flex items-center justify-center text-white">
                              <CheckCircle size={16} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Image URL input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">أو الصق رابط صورة مخصص</label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://example.com/ad-image.jpg"
                        value={newAdForm.image}
                        onChange={(e) => setNewAdForm({ ...newAdForm, image: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full pl-10"
                        dir="ltr"
                      />
                      <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                </div>

                {/* Submit Actions Footer (Fixed at bottom) */}
                <div className="flex gap-3 justify-end items-center p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 border border-[#DBEAFE] bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    إضافة الإعلان
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
