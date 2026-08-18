import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, Search, Megaphone, X } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '../services/usersApi';
import { adsApi } from '../services/adsApi';
import UsersTable from '../components/users/UsersTable';
import AddAdClientModal from '../components/AddAdClientModal';
import AddAdForUserModal from '../components/AddAdForUserModal';
import ViewUserModal from '../components/users/ViewUserModal';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import EditUserModal from '../components/users/EditUserModal';

const UsersManagementPage = () => {
  const { t } = useTranslation();
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

   const { data: users = [], isLoading } = useQuery({
    queryKey: ['ads-users', debouncedSearch],
    queryFn: () => usersApi.getUsers(debouncedSearch),
    placeholderData: (previousData) => previousData,
  });

   const { data: activeAdsCount = 0, isLoading: isLoadingActiveAds } = useQuery({
    queryKey: ['active-ads-count'],
    queryFn: () => adsApi.getActiveAdsCount(),
    placeholderData: (previousData) => previousData,
  });

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
  });

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
      queryClient.invalidateQueries({ queryKey: ['ads-users'] });
      toast.success('تم تحديث بيانات العميل بنجاح');
      setSelectedUserForEdit(null);
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء تحديث بيانات العميل';
      toast.error(serverMessage);
    }
  });

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

  // تصفية المستخدمين لاستثناء حسابات الأدمن (System Admin)
  const nonAdminUsers = users.filter(user => {
    const isSystemAdmin = 
      user.role?.toLowerCase() === 'systemadmin' || 
      user.role?.toLowerCase() === 'admin' || 
      user.name === 'System Admin' ||
      user.role === 'مسؤول النظام';
    return !isSystemAdmin;
  });

  const filteredUsers = nonAdminUsers.map(user => {
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
    <div className="p-2 sm:p-4 flex flex-col gap-5 bg-transparent font-zain" dir="rtl">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-500/20 shadow-xs flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div className="text-right">
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{t('ads.usersManagementTitle') || 'إدارة المستخدمين'}</h1>
            </div>
        </div>
      </div>

      {/* 2. Top Toolbar: Full Width Search Bar */}
      <div className="w-full">
        <div className="relative w-full group flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t('ads.searchUsersPlaceholder') || 'ابحث باسم العميل، رقم الهاتف، أو المنشأة...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-10 py-3.5 rounded-2xl border-2 border-sky-500/40 dark:border-sky-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-bold text-xs sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 shadow-xs transition-all text-right font-zain"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-sky-500 text-white shadow-xs flex items-center justify-center pointer-events-none">
              <Search size={16} strokeWidth={2.5} />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

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

      <AddAdClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onCreateClient={createClientMutation.mutateAsync}
        isSubmitting={createClientMutation.isPending}
      />

      <AddAdForUserModal
        isOpen={!!selectedUserForAd}
        onClose={() => setSelectedUserForAd(null)}
        user={selectedUserForAd}
        isSubmitting={createAdMutation.isPending}
        onCreateAd={(adData) => createAdMutation.mutateAsync({ userId: selectedUserForAd.id, adData })}
      />

      
      <ViewUserModal
        isOpen={!!selectedUserForView}
        onClose={() => setSelectedUserForView(null)}
        user={selectedUserForView}
      />

      
      <EditUserModal
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onSave={(id, userData) => updateUserMutation.mutateAsync({ userId: id, userData })} 
      />

      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => deleteUserMutation.mutate(deleteTarget.id)}
        title={t('ads.deleteUserModalTitle')}
        message={t('ads.deleteUserModalMessage', { name: deleteTarget?.name })}
        confirmText={t('ads.deleteUserConfirm')}
        cancelText={t('membership.confirmNo')}
        type="danger"
      />

    </div>
  );
};

export default UsersManagementPage;
