import React, { useState, useEffect } from 'react';
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
import EditUserModal from '../components/users/EditUserModal'; // 🛠️ استيراد مودل التعديل المكتوب سابقاً
const UsersManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedUserForAd, setSelectedUserForAd] = useState(null);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // تحديث نص البحث بمهلة زمنية لمنع الإرسال مع كل ضغطة زر
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 1. Fetch Users Query (إرسال الاستعلام للباك إند)
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['ads-users', debouncedSearch],
    queryFn: () => usersApi.getUsers(debouncedSearch),
    placeholderData: (previousData) => previousData,
  });

  // 1.5. Fetch Active Ads Count Query
  const { data: activeAdsCount = 0, isLoading: isLoadingActiveAds } = useQuery({
    queryKey: ['active-ads-count'],
    queryFn: () => adsApi.getActiveAdsCount(),
    placeholderData: (previousData) => previousData,
  });

  // 1.6. Fetch All Ads List Query (to calculate active ads count per user locally)
  const { data: allAds = [] } = useQuery({
    queryKey: ['admin-ads-all-list'],
    queryFn: () => adsApi.getAllRawAds(),
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({ queryKey: ['active-ads-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ads-all-list'] });
      toast.success('تمت إضافة الإعلان للمستخدم بنجاح');
      setSelectedUserForAd(null);
    },
    onError: (error) => {
      console.error("Failed to create ad for user:", error);
      const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة الإعلان للمستخدم';
      toast.error(serverMessage);
    }
  });
const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => usersApi.updateUser(userId, userData),
    onSuccess: () => {
      // عمل تحديث فوري للكاش لإعادة جلب البيانات المعدلة من الباك إند تلقائياً
      queryClient.invalidateQueries({ queryKey: ['ads-users'] });
      toast.success('تم تحديث بيانات العميل بنجاح');
      setSelectedUserForEdit(null); // إغلاق المودل
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء تحديث بيانات العميل';
      toast.error(serverMessage);
    }
  });
  // 4. Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads-users'] });
      queryClient.invalidateQueries({ queryKey: ['active-ads-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ads-all-list'] });
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

  // Compute live active ads count per user based on allAds from the backend
  const filteredUsers = users.map(user => {
    const userActiveAdsCount = allAds.filter(ad => {
      const adUserId = ad.userId || ad.user?.id || ad.user?.userId;
      const isUserMatch = String(adUserId) === String(user.id);
      const isActive = ad.isActive === true || ad.status === 'active';
      return isUserMatch && isActive;
    }).length;

    return {
      ...user,
      advertisementsCount: userActiveAdsCount
    };
  });

  return (
    <div className="p-2 flex flex-col gap-6 bg-transparent" dir="rtl">
      
      
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

       
        <button
          onClick={() => setIsAddClientOpen(true)}
          className="bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/10 rounded-2xl flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center cursor-pointer"
        >
          <UserPlus size={18} strokeWidth={2.5} />
          إضافة مستخدم إعلانات
        </button>
      </div>

      {/* 2 & 3. Unified Stats & Search Control Center */}
      <div className="bg-white dark:bg-bg-card border border-border-main/50 rounded-[2rem] py-4 px-6 shadow-sm flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-8 w-full mt-2">
        
        {/* Right Section: Modern Search Box */}
        <div className="flex-shrink-0 w-full lg:w-80 flex flex-col gap-1.5">
          <label className="text-[11px] font-black text-text-muted text-right mr-1">البحث السريع عن العملاء</label>
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
        <div className="hidden lg:block w-[1px] h-10 bg-border-main/20" />

        {/* Left Section: Compact Stats Grid */}
        <div className="flex-grow grid grid-cols-2 gap-4 divide-x divide-x-reverse divide-border-main/20">
          
          {/* Stat 1: Total Users */}
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <span className="text-xs font-bold text-text-muted mb-1.5 block">إجمالي العملاء</span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-text-main">{isLoading ? '...' : users.length}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
            </div>
          </div>

          {/* Stat 2: Active Ads */}
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <span className="text-xs font-bold text-text-muted mb-1.5 block">الإعلانات النشطة</span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-text-main">{isLoading || isLoadingActiveAds ? '...' : activeAdsCount}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
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
        onEditClick={(user) => setSelectedUserForEdit(user)}
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

      {/* D. Edit User Modal */}
      <EditUserModal
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onSave={(id, userData) => updateUserMutation.mutateAsync({ userId: id, userData })} 
/>

      {/* E. Delete User Confirmation Modal */}
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
