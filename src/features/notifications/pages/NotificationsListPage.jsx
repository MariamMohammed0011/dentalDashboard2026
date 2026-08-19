import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bell, BellRing, Eye, EyeOff,
  UserPlus, Megaphone, Filter, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

import NotificationsTable from '../components/NotificationsTable';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { notificationsService } from '../services/notificationsService';

const NotificationsListPage = () => {
  const queryClient = useQueryClient();

  // State variables for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, join, message, update, reminder, ad
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, read, unread
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications-list-data'],
    queryFn: () => notificationsService.getNotifications(),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  // 2. Mutations
  const toggleReadMutation = useMutation({
    mutationFn: (notif) => notificationsService.markAsRead(notif.id, notif.type),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['notifications-list-data'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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


  // 3. Filtered & Searched Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // Filter by type
      let matchType = selectedType === 'all';
      if (!matchType) {
        if (selectedType === 'join') {
          matchType = notif.type === 'join' || notif.type === 'blog';
        } else {
          matchType = notif.type === selectedType;
        }
      }

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

  const typeTabs = [
    { id: 'all', label: 'الكل', icon: Bell, activeColor: 'bg-primary text-white border-2 border-primary shadow-md shadow-primary/30 scale-[1.02]', inactiveColor: 'bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50', iconColor: 'text-primary' },
    { id: 'join', label: 'المنشورات', icon: UserPlus, activeColor: 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-md shadow-emerald-500/30 scale-[1.02]', inactiveColor: 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50', iconColor: 'text-emerald-500' },
    { id: 'ad', label: 'إعلانات', icon: Megaphone, activeColor: 'bg-sky-500 text-white border-2 border-sky-500 shadow-md shadow-sky-500/30 scale-[1.02]', inactiveColor: 'bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 border-2 border-sky-200 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/50', iconColor: 'text-sky-500' },
    { id: 'complaint', label: 'الشكاوى والتنبيهات', icon: AlertCircle, activeColor: 'bg-rose-500 text-white border-2 border-rose-500 shadow-md shadow-rose-500/30 scale-[1.02]', inactiveColor: 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border-2 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50', iconColor: 'text-rose-500' },
  ];

  return (
    <div className="flex flex-col gap-6 px-2 sm:px-8 lg:px-4 pb-10 min-h-full" dir="rtl">

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 mt-2">
     <div className="flex items-center gap-4">
  <div className="p-3.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl shadow-sm border border-rose-500/20 flex items-center justify-center">
    <Bell size={28} className="text-rose-600 dark:text-rose-400" />
  </div>
  <div className="text-right">
    <div className="flex items-center gap-3">
      <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">مركز الإشعارات والتنبيهات</h1>
    </div>
    <p className="text-text-muted text-xs sm:text-sm mt-1 font-medium">متابعة كافة الإشعارات والطلبات والتنبيهات الواردة على المنصة بشكل مباشر</p>
  </div>
</div>


      </div>

      {/* 2. Animated Statistics Ribbon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full text-right">
        {/* Total Notifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-bg-card border border-border-main/60 rounded-[2rem] p-5 shadow-sm shadow-slate-100/50 dark:shadow-none flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider mb-1">إجمالي التنبيهات</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">{notifications.length}</span>
              <span className="text-xs font-bold text-text-muted">تنبيه</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <BellRing size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Unread Notifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-bg-card border border-border-main/60 rounded-[2rem] p-5 shadow-sm shadow-slate-100/50 dark:shadow-none flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider mb-1">غير المقروءة</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-red-500 tracking-tight">{totalUnread}</span>
              <span className="text-xs font-bold text-red-400">جديد</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <EyeOff size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-red-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Read Notifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-bg-card border border-border-main/60 rounded-[2rem] p-5 shadow-sm shadow-slate-100/50 dark:shadow-none flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider mb-1">تمت قراءتها</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tight">{notifications.length - totalUnread}</span>
              <span className="text-xs font-bold text-emerald-400">مقروء</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 text-emerald-500 dark:text-emerald-400 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <Eye size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Filtered Count Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-bg-card border border-border-main/60 rounded-[2rem] p-5 shadow-sm shadow-slate-100/50 dark:shadow-none flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col text-right z-10">
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider mb-1">معروضة حالياً</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{filteredNotifications.length}</span>
              <span className="text-xs font-bold text-purple-400">مطابق</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:rotate-[12deg] group-hover:scale-110 transition-transform duration-300 z-10 shadow-sm">
            <Filter size={24} />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      </div>

      {/* 3. Filters & Controls Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="  p-5 sm:p-7  flex flex-col gap-6 w-full"
      >
        {/* Filters Controls Section (Each filter on its own line) */}
        <div className="flex flex-col gap-4 w-full font-zain">

          {/* 1. Filter by Type (Full Row) */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Filter size={15} className="text-sky-500" />
              <span>تصفية حسب نوع الإشعار:</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs w-full">
              {typeTabs.map(tab => {
                const TabIcon = tab.icon;
                const isSelected = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedType(tab.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-sky-500 text-white font-black shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <TabIcon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Filter by Read Status (Full Row) */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Sparkles size={15} className="text-amber-500" />
              <span>تصفية حسب حالة القراءة:</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs w-full">
              {[
                { id: 'all', label: 'الكل (جميع الإشعارات)', icon: Bell },
                { id: 'unread', label: 'الإشعارات غير المقروءة', icon: EyeOff },
                { id: 'read', label: 'الإشعارات المقروءة', icon: Eye },
              ].map(status => {
                const StatusIcon = status.icon;
                const isSelected = selectedStatus === status.id;
                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setSelectedStatus(status.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-sky-500 text-white font-black shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <StatusIcon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                    <span>{status.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </motion.div>

      {/* 4. Table & Cards Section */}
      <div className="w-full flex flex-col gap-6">
        <NotificationsTable
          notifications={paginatedNotifications}
          isLoading={isLoading}
          onToggleRead={(notif) => toggleReadMutation.mutate(notif)}
        />

        {/* 5. Pagination */}
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

