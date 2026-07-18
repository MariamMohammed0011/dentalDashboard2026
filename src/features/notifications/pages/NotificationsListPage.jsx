import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bell, Plus, Search, CheckCircle2, Trash2, BellRing, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

import NotificationsTable from '../components/NotificationsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { notificationsService } from '../../../components/shared/Notifications/services/notificationsService';

const NotificationsListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State variables for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, join, message, update, reminder, ad
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, read, unread
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Fetch notifications
  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications-list-data'],
    queryFn: () => notificationsService.getNotifications(),
    refetchInterval: 5000, // Auto refresh every 5 seconds
    refetchIntervalInBackground: true,
  });

  // 2. Mutations
  const toggleReadMutation = useMutation({
    mutationFn: (id) => notificationsService.markAsRead(id),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['notifications-list-data'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['notifications'] }); // sync top navbar badge
      toast.success('تم تعديل حالة قراءة الإشعار');
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['notifications-list-data'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => notificationsService.deleteNotification(id),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['notifications-list-data'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم حذف الإشعار بنجاح');
    }
  });

  const clearAllMutation = useMutation({
    mutationFn: () => notificationsService.clearAllNotifications(),
    onSuccess: () => {
      queryClient.setQueryData(['notifications-list-data'], []);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم مسح جميع الإشعارات بنجاح');
    }
  });

  // 3. Filtered & Searched Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // Filter by type
      const matchType = selectedType === 'all' || notif.type === selectedType;
      
      // Filter by read status
      let matchStatus = true;
      if (selectedStatus === 'read') matchStatus = notif.read === true;
      if (selectedStatus === 'unread') matchStatus = notif.read === false;

      // Filter by search text
      const matchSearch = !searchQuery.trim() || 
        notif.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(notif.id).includes(searchQuery);

      return matchType && matchStatus && matchSearch;
    });
  }, [notifications, selectedType, selectedStatus, searchQuery]);

  // Total unread count of ALL notifications
  const totalUnread = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Reset pagination page if filter matches change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedType, selectedStatus, searchQuery]);

  // Paginated Notifications
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage, itemsPerPage]);

  const pagination = useMemo(() => ({
    total: filteredNotifications.length,
    page: currentPage,
    totalPages: Math.ceil(filteredNotifications.length / itemsPerPage) || 1,
  }), [filteredNotifications, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand-blue-light text-brand-blue rounded-2xl shadow-sm border border-brand-blue-border/50 flex items-center justify-center">
            <Bell size={28} className="text-brand-blue" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">أرشيف الإشعارات</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">استعراض والتحكم بكافة التنبيهات والطلبات الواردة والمرسلة على المنصة</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/dashboard/notifications/send')}
          className="bg-brand-blue text-white hover:bg-brand-blue-hover shadow-lg shadow-blue-500/10 rounded-2xl flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          إرسال إشعار جديد
        </button>
      </div>

      {/* 2. Sub-Tabs switcher inside page */}
      <div className="flex border-b border-gray-200 dark:border-slate-800/80 -mb-2 mt-2 gap-6">
        <button
          onClick={() => navigate('/dashboard/notifications/send')}
          className="pb-3 text-sm font-bold border-b-2 border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-250 transition-all px-1 cursor-pointer"
        >
          إرسال إشعار جديد
        </button>
        <button
          onClick={() => {}}
          className="pb-3 text-sm font-black border-b-2 border-brand-blue text-brand-blue transition-all relative px-1 cursor-pointer"
        >
          كل الإشعارات (الأرشيف)
        </button>
      </div>

      {/* 3. Stats & Control Center */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/50 rounded-[2.5rem] p-5 shadow-sm flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 w-full mt-2">
        
        {/* Search Input */}
        <div className="flex-shrink-0 w-full xl:w-72 flex flex-col gap-1.5 text-right">
          <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 mr-1">البحث عن تنبيه</label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث بمضمون الإشعار، أو الرقم المعرف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white placeholder-gray-400/80 dark:placeholder-slate-500 font-bold text-xs sm:text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-500/10 transition-all text-right"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400/85" size={16} />
          </div>
        </div>

        {/* Filter Tabs by Notification Type */}
        <div className="flex flex-col gap-1.5 text-right flex-grow">
          <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 mr-1">تصفية حسب النوع</label>
          <div className="flex flex-wrap gap-1.5 bg-gray-50/50 dark:bg-slate-850 p-1 rounded-2xl border border-gray-100 dark:border-slate-800">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'ad', label: 'إعلانات' },
              { id: 'reminder', label: 'تنبيهات' },
              { id: 'join', label: 'طلبات انضمام' },
              { id: 'update', label: 'تحديثات' },
              { id: 'message', label: 'رسائل' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-white dark:bg-slate-900 text-[#367AFF] shadow-sm border border-gray-100 dark:border-slate-800'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Read/Unread Filters */}
        <div className="flex-shrink-0 flex flex-col gap-1.5 text-right">
          <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 mr-1">حالة القراءة</label>
          <div className="flex bg-gray-50/50 dark:bg-slate-850 p-1 rounded-2xl border border-gray-100 dark:border-slate-800">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'unread', label: 'غير المقروءة' },
              { id: 'read', label: 'المقروءة' },
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedStatus === status.id
                    ? 'bg-white dark:bg-slate-900 text-[#367AFF] shadow-sm border border-gray-100 dark:border-slate-800'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2 xl:self-end pt-1">
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={totalUnread === 0 || isLoading}
            className="flex items-center gap-1.5 text-xs text-[#367AFF] font-bold bg-[#E8F1FF] hover:bg-[#D2E4FF] px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={15} />
            تحديد الكل كمقروء
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من رغبتك في مسح كافة الإشعارات نهائياً؟')) {
                clearAllMutation.mutate();
              }
            }}
            disabled={notifications.length === 0 || isLoading}
            className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-red-100/50"
          >
            <Trash2 size={15} />
            مسح الأرشيف
          </button>
        </div>

      </div>

      {/* 4. Statistics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-right -mb-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">إجمالي التنبيهات</span>
            <span className="text-lg font-black text-gray-800 dark:text-white mt-1 block">{notifications.length}</span>
          </div>
          <BellRing size={20} className="text-[#367AFF]" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">غير المقروءة</span>
            <span className="text-lg font-black text-red-500 mt-1 block">{totalUnread}</span>
          </div>
          <EyeOff size={20} className="text-red-500" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">تمت قراءتها</span>
            <span className="text-lg font-black text-emerald-500 mt-1 block">{notifications.length - totalUnread}</span>
          </div>
          <Eye size={20} className="text-emerald-500" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">مفلترة حالياً</span>
            <span className="text-lg font-black text-gray-700 dark:text-gray-300 mt-1 block">{filteredNotifications.length}</span>
          </div>
          <Bell size={20} className="text-violet-500" />
        </div>
      </div>

      {/* 5. Table Section */}
      <div className="w-full flex flex-col gap-6 mt-2">
        <NotificationsTable 
          notifications={paginatedNotifications} 
          isLoading={isLoading} 
          onToggleRead={(id) => toggleReadMutation.mutate(id)}
          onDelete={(id) => deleteNotificationMutation.mutate(id)}
        />

        {/* 6. Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <MembershipPagination 
              pagination={pagination} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationsListPage;
