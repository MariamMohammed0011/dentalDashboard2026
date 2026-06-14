import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, Search, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '../services/usersApi';
import { adsApi } from '../services/adsApi';
import UsersTable from '../components/users/UsersTable';
import AddAdClientModal from '../components/AddAdClientModal';
import AddAdForUserModal from '../components/AddAdForUserModal';
import ViewUserModal from '../components/users/ViewUserModal';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

const UsersManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedUserForAd, setSelectedUserForAd] = useState(null);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 1. Fetch Users Query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['ads-users'],
    queryFn: usersApi.getUsers,
  });

  // 2. Add Ad Client Mutation
  const createClientMutation = useMutation({
    mutationFn: (clientData) => adsApi.createAdClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads-users'] });
      setIsAddClientOpen(false);
    },
    // Error is handled inside the modal/hook
  });

  // 3. Add Advertisement For User Mutation
  const createAdMutation = useMutation({
    mutationFn: ({ userId, adData }) => adsApi.createAdForUser(userId, adData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads-users'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast.success('تمت إضافة الإعلان للمستخدم بنجاح');
      setSelectedUserForAd(null);
    },
    onError: (error) => {
      console.error("Failed to create ad for user:", error);
      const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة الإعلان للمستخدم';
      toast.error(serverMessage);
    }
  });

  // 4. Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads-users'] });
      toast.success('تم حذف المستخدم بنجاح');
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
      const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء حذف المستخدم';
      toast.error(serverMessage);
    }
  });

  // Handle client-side search filtering
  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.phone && user.phone.includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.namePlace && user.namePlace.toLowerCase().includes(q)) ||
      (user.cityPlace && user.cityPlace.toLowerCase().includes(q))
    );
  });

  // Active ads count calculation
  const totalAdsCount = users.reduce((sum, user) => sum + (user.advertisementsCount || 0), 0);

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 bg-transparent" dir="rtl">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center">
            <Users size={28} className="text-primary" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">إدارة المستخدمين</h1>
            <p className="text-text-muted text-xs sm:text-sm mt-1 font-medium">إدارة حسابات عملاء الإعلانات وإنشاء الحملات الإعلانية المخصصة لهم</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAddClientOpen(true)}
          className="bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/10 rounded-2xl flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center cursor-pointer"
        >
          <UserPlus size={18} strokeWidth={2.5} />
          إضافة مستخدم إعلانات
        </button>
      </div>

      {/* 2 & 3. Unified Stats & Search Control Center */}
      <div className="bg-white dark:bg-bg-card border border-border-main/50 rounded-[2rem] p-6 shadow-sm flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 w-full mt-2">
        
        {/* Right Section: Modern Search Box */}
        <div className="flex-shrink-0 w-full lg:w-96 flex flex-col gap-1.5">
          <label className="text-[11px] font-black text-text-muted text-right">البحث السريع عن العملاء</label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث باسم العميل، رقم الهاتف، أو المنشأة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-border-main/50 bg-bg-main/30 text-text-main placeholder-text-muted/50 font-bold text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted/50" size={16} />
          </div>
        </div>

        {/* Vertical Separator for Large Screens */}
        <div className="hidden lg:block w-[1px] h-12 bg-border-main/20" />

        {/* Left Section: Compact Stats Grid */}
        <div className="flex-grow grid grid-cols-3 gap-2 sm:gap-4 divide-x divide-x-reverse divide-border-main/30">
          
          {/* Stat 1: Total Users */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-4 text-center">
            <span className="text-[10px] sm:text-xs font-bold text-text-muted mb-1 block">إجمالي العملاء</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-lg sm:text-xl font-black text-text-main">{isLoading ? '...' : users.length}</span>
            </div>
          </div>

          {/* Stat 2: Active Ads */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-4 text-center text-right">
            <span className="text-[10px] sm:text-xs font-bold text-text-muted mb-1 block">الإعلانات النشطة</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-lg sm:text-xl font-black text-text-main">{isLoading ? '...' : totalAdsCount}</span>
            </div>
          </div>

          {/* Stat 3: Avg Ads per User */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-4 text-center">
            <span className="text-[10px] sm:text-xs font-bold text-text-muted mb-1 block">متوسط الإعلانات</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-lg sm:text-xl font-black text-text-main">
                {isLoading || users.length === 0 ? '0' : (totalAdsCount / users.length).toFixed(1)}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Results Count Summary */}
      {/* <div className="flex justify-between items-center w-full px-2 mt-2 -mb-1">
        <span className="text-[11px] sm:text-xs font-black text-text-muted">
          أظهرت النتائج: {filteredUsers.length} من {users.length} عملاء
        </span>
      </div> */}

      {/* 4. Table / Cards View */}
      <UsersTable 
        users={filteredUsers}
        isLoading={isLoading}
        onAddAdClick={(user) => setSelectedUserForAd(user)}
        onViewClick={(user) => setSelectedUserForView(user)}
        onDeleteClick={(user) => {
          setDeleteTarget(user);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* ====================================================== */}
      {/* MODALS */}
      {/* ====================================================== */}

      {/* A. Add Ad Client Modal */}
      <AddAdClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onCreateClient={createClientMutation.mutateAsync}
        isSubmitting={createClientMutation.isPending}
      />

      {/* B. Add Ad for Specific User Modal */}
      <AddAdForUserModal
        isOpen={!!selectedUserForAd}
        onClose={() => setSelectedUserForAd(null)}
        user={selectedUserForAd}
        isSubmitting={createAdMutation.isPending}
        onCreateAd={(adData) => createAdMutation.mutateAsync({ userId: selectedUserForAd.id, adData })}
      />

      {/* C. View User Details Modal */}
      <ViewUserModal
        isOpen={!!selectedUserForView}
        onClose={() => setSelectedUserForView(null)}
        user={selectedUserForView}
      />

      {/* D. Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => deleteUserMutation.mutate(deleteTarget.id)}
        title="حذف مستخدم الإعلانات"
        message={`هل أنت متأكد من رغبتك في حذف العميل "${deleteTarget?.name}"؟ سيتم حذف جميع إعلاناته المرتبطة به بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف المستخدم"
        cancelText="تراجع"
        type="danger"
      />

    </div>
  );
};

export default UsersManagementPage;
