import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, Search, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '../services/usersApi';
import { adsApi } from '../services/adsApi';
import UsersTable from '../components/users/UsersTable';
import AddAdClientModal from '../components/AddAdClientModal';
import AddAdForUserModal from '../components/AddAdForUserModal';

const UsersManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedUserForAd, setSelectedUserForAd] = useState(null);

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

      {/* 2. Stats Dashboard Cards (Quick Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border-main/40 rounded-2xl p-5 shadow-sm text-right flex items-center justify-between">
          <div>
            <span className="text-text-muted text-xs font-bold block mb-1">إجمالي المستخدمين</span>
            <span className="text-2xl font-black text-text-main">{isLoading ? '...' : users.length} عميل</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
        
        <div className="bg-bg-card border border-border-main/40 rounded-2xl p-5 shadow-sm text-right flex items-center justify-between">
          <div>
            <span className="text-text-muted text-xs font-bold block mb-1">إجمالي الإعلانات النشطة للعملاء</span>
            <span className="text-2xl font-black text-text-main">{isLoading ? '...' : totalAdsCount} إعلان</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Megaphone size={20} />
          </div>
        </div>

        <div className="bg-bg-card border border-border-main/40 rounded-2xl p-5 shadow-sm text-right flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-text-muted text-xs font-bold block mb-1">متوسط الإعلانات لكل عميل</span>
            <span className="text-2xl font-black text-text-main">
              {isLoading || users.length === 0 ? '0' : (totalAdsCount / users.length).toFixed(1)} إعلان/عميل
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Search size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search Filter Bar */}
      <div className="bg-bg-card rounded-2xl border border-border-main/40 shadow-sm p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="ابحث عن اسم العميل، رقم الهاتف، اسم المنشأة، أو المدينة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-bg-main/40 border border-border-main/60 rounded-2xl pr-11 pl-4 py-2.5 text-text-main placeholder-text-muted/60 font-medium text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all w-full text-right"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/60" size={18} />
        </div>
      </div>

      {/* 4. Table / Cards View */}
      <UsersTable 
        users={filteredUsers}
        isLoading={isLoading}
        onAddAdClick={(user) => setSelectedUserForAd(user)}
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

    </div>
  );
};

export default UsersManagementPage;
