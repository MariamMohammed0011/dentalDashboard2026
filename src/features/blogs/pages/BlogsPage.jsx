import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Trash2,
  BookOpen,
  User,
  FlaskConical,
  Calendar,
  Heart,
  MessageCircle,
  Eye,
  X,
  AlertCircle,
  Check,
  Filter,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  LayoutGrid
} from "lucide-react";
import { useBlogs } from "../hooks/useBlogs";
import MembershipPagination from "../../membership/components/MembershipPagination";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import Search from "../../../components/shared/Search/Search";

const BlogStatCard = ({ title, count, icon: Icon, colorBadgeClass, iconColorClass, bgGlowClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-bg-card border border-border-main/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm shadow-slate-100/50 dark:shadow-none flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
  >
    <div className="flex flex-col text-right z-10 min-w-0">
      <span className="text-text-muted text-[11px] sm:text-xs font-bold mb-1 sm:mb-1.5 uppercase tracking-wider truncate">{title}</span>
      <div className="flex items-baseline gap-1.5 sm:gap-2">
        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-text-main tracking-tight">{count}</span>
        <span className="text-[11px] sm:text-xs font-bold text-text-muted">مقالة</span>
      </div>
    </div>
    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${colorBadgeClass} transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110 shadow-sm z-10 shrink-0`}>
      <Icon size={22} className={`${iconColorClass} sm:w-[26px] sm:h-[26px]`} />
    </div>
    <div className={`absolute -bottom-8 -left-8 w-28 h-28 rounded-full ${bgGlowClass} blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none`} />
  </motion.div>
);


const BlogCardSkeleton = () => (
  <div className="bg-bg-card border border-border-main rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col h-[420px] sm:h-[450px] animate-pulse">
    <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-800 w-full" />
    <div className="p-4 sm:p-6 flex-grow flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex flex-col gap-2">
            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
        </div>
        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="w-full h-5 bg-gray-200 dark:bg-gray-800 rounded-full mt-2" />
      <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-800 rounded-full" />
      <div className="w-5/6 h-3 bg-gray-200 dark:bg-gray-800 rounded-full" />
      <div className="mt-auto pt-4 border-t border-border-main/50 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="w-10 h-4 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-10 h-4 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default function BlogsPage() {
  const { t } = useTranslation();
  const {
    blogs,
    stats,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    activeArticle,
    setActiveArticle,
    rejectTarget,
    setRejectTarget,
    isRejectModalOpen,
    setIsRejectModalOpen,
    handleRejectConfirm,
    approveTarget,
    setApproveTarget,
    isApproveModalOpen,
    setIsApproveModalOpen,
    handleApproveConfirm
  } = useBlogs();

  return (
    <div className="px-4 sm:px-8 lg:px-4 pb-10 min-h-full flex flex-col gap-8 text-right" dir="rtl">

      {/* 📌 Header Title Bar with Search beside it */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 pt-2">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center">
            <BookOpen size={28} className="text-primary" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
              {t('blogs.headerTitle')}
            </h1>
            <p className="text-text-muted text-xs sm:text-sm mt-1 font-medium">
              {t('blogs.headerDesc')}
            </p>
          </div>
        </div>

        {/* Search component next to header */}
        <div className="w-full sm:w-80">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('blogs.searchPlaceholder')}
            className="w-full"
            onClear={() => setSearchQuery('')}
          />
        </div>
      </div>

      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <BlogStatCard
          title={t('blogs.stats.total')}
          count={stats.total}
          icon={BookOpen}
          colorBadgeClass="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30"
          iconColorClass="text-blue-600 dark:text-blue-400"
          bgGlowClass="bg-blue-500"
        />
        <BlogStatCard
          title={t('blogs.stats.doctorCount')}
          count={stats.doctorCount}
          icon={Stethoscope}
          colorBadgeClass="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30"
          iconColorClass="text-amber-600 dark:text-amber-400"
          bgGlowClass="bg-amber-500"
        />
        <BlogStatCard
          title={t('blogs.stats.labCount')}
          count={stats.labCount}
          icon={FlaskConical}
          colorBadgeClass="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30"
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          bgGlowClass="bg-emerald-500"
        />
      </div>

      {/* 🔍 Professional Filter & Search Section */}
      <div className="py-2 flex flex-col gap-6">
        {/* Top Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">

          {/* Roles Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Filter size={14} className="text-primary animate-pulse" />
              الجهة الناشرة
            </label>
            <div className="flex gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm w-full overflow-x-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => { setSelectedRole("all"); setCurrentPage(1); }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedRole === "all"
                    ? "bg-primary text-white border-2 border-primary shadow-md shadow-primary/30 scale-[1.02]"
                    : "bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                }`}
              >
                <LayoutGrid size={16} className={selectedRole === "all" ? "text-white" : "text-primary"} />
                <span>{t('blogs.tabs.all')}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRole("doctor"); setCurrentPage(1); }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedRole === "doctor"
                    ? "bg-amber-500 text-white border-2 border-amber-500 shadow-md shadow-amber-500/30 scale-[1.02]"
                    : "bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                }`}
              >
                <Stethoscope size={16} className={selectedRole === "doctor" ? "text-white" : "text-amber-500"} />
                <span>{t('blogs.tabs.doctors')}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRole("lab"); setCurrentPage(1); }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedRole === "lab"
                    ? "bg-emerald-500 text-white border-2 border-emerald-500 shadow-md shadow-emerald-500/30 scale-[1.02]"
                    : "bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                }`}
              >
                <FlaskConical size={16} className={selectedRole === "lab" ? "text-white" : "text-emerald-500"} />
                <span>{t('blogs.tabs.labs')}</span>
              </button>
            </div>
          </div>

          {/* Post Status Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
              حالة النشر والمراجعة
            </label>
            <div className="flex gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm w-full overflow-x-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => { setSelectedStatus("pending"); setCurrentPage(1); }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedStatus === "pending"
                    ? "bg-amber-500 text-white border-2 border-amber-500 shadow-md shadow-amber-500/30 scale-[1.02]"
                    : "bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                }`}
              >
                <Clock size={16} className={selectedStatus === "pending" ? "text-white" : "text-amber-500"} />
                <span>{t('blogs.tabs.pending')}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedStatus("approved"); setCurrentPage(1); }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedStatus === "approved"
                    ? "bg-emerald-500 text-white border-2 border-emerald-500 shadow-md shadow-emerald-500/30 scale-[1.02]"
                    : "bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                }`}
              >
                <CheckCircle2 size={16} className={selectedStatus === "approved" ? "text-white" : "text-emerald-500"} />
                <span>{t('blogs.tabs.approved')}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedStatus("rejected"); setCurrentPage(1); }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedStatus === "rejected"
                    ? "bg-rose-500 text-white border-2 border-rose-500 shadow-md shadow-rose-500/30 scale-[1.02]"
                    : "bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border-2 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                }`}
              >
                <XCircle size={16} className={selectedStatus === "rejected" ? "text-white" : "text-rose-500"} />
                <span>{t('blogs.tabs.rejected')}</span>
              </button>
            </div>
          </div>

        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <BlogCardSkeleton key={i} />)
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card border border-border-main rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
            >

              <div className="h-40 sm:h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />


                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/20 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 border border-white/10">
                  <Calendar size={12} />
                  <span>{blog.publishDate}</span>
                </div>
              </div>


              <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
                <div>


                  <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary/10 object-cover shrink-0"
                      />
                      <div className="flex flex-col text-right min-w-0">
                        <span className="text-text-main font-bold text-xs sm:text-sm leading-tight truncate">{blog.author.name}</span>
                        <span className="text-text-muted text-[10px] sm:text-xs font-medium leading-none mt-1 truncate">{blog.author.specialty}</span>
                      </div>
                    </div>


                    <span className={`px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold border shrink-0 ${blog.author.role === "doctor"
                        ? "bg-blue-50/50 dark:bg-blue-950/30 text-blue-500 border-blue-200/50 dark:border-blue-900/30"
                        : "bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-500 border-emerald-200/50 dark:border-emerald-900/30"
                      }`}>
                      {blog.author.role === "doctor" ? t('doctors.doctor') : t('common.lab')}
                    </span>
                  </div>


                  <h3 className="text-text-main font-bold text-sm sm:text-base leading-snug mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border-main/50 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4">


                  <div className="flex gap-3 sm:gap-4 text-text-muted shrink-0">
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs whitespace-nowrap">
                      <Heart size={14} className="text-red-500/80 fill-red-500/10" />
                      <span>{t('blogs.likesCount', { count: blog.likes })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs whitespace-nowrap">
                      <MessageCircle size={14} className="text-blue-500/80" />
                      <span>{t('blogs.commentsCount', { count: blog.comments })}</span>
                    </div>
                  </div>


                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ms-auto sm:ms-0">
                    <button
                      onClick={() => setActiveArticle(blog)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                      title={t('blogs.actions.review')}
                    >
                      <Eye size={14} />
                      <span>{t('blogs.actions.reviewLabel')}</span>
                    </button>
                    {selectedStatus !== "approved" && (
                      <button
                        onClick={() => {
                          setApproveTarget(blog);
                          setIsApproveModalOpen(true);
                        }}
                        className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-500 rounded-xl transition-all active:scale-95 cursor-pointer"
                        title={t('blogs.actions.approve')}
                      >
                        <Check size={15} />
                      </button>
                    )}
                    {selectedStatus !== "rejected" && (
                      <button
                        onClick={() => {
                          setRejectTarget(blog);
                          setIsRejectModalOpen(true);
                        }}
                        className="p-1.5 sm:p-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 rounded-xl transition-all active:scale-95 cursor-pointer"
                        title={t('blogs.actions.reject')}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ))
        ) : (

          <div className="col-span-full bg-white dark:bg-bg-card border border-border-main rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-[1.5rem] flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-text-main">{t('blogs.emptyState.title')}</h3>
            <p className="text-text-muted text-sm max-w-sm">
              {t('blogs.emptyState.desc')}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("all");
              }}
              className="mt-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              {t('blogs.emptyState.reset')}
            </button>
          </div>
        )}
      </div>


      {!isLoading && blogs.length > 0 && (
        <MembershipPagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}


      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir="rtl">


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveArticle(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />


              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="relative bg-white dark:bg-bg-card w-full max-w-3xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >


                <div className="h-48 sm:h-64 relative bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />


                  <button
                    onClick={() => setActiveArticle(null)}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-2.5 bg-black/30 hover:bg-black/50 text-white rounded-xl transition-colors backdrop-blur-md border border-white/10"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>


                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 left-4 sm:left-8 flex justify-between items-end text-white">
                    <div className="flex flex-col text-right gap-1">
                      <span className={`self-start px-2.5 py-0.5 rounded-lg text-xs font-bold ${activeArticle.author.role === "doctor"
                          ? "bg-blue-500 text-white"
                          : "bg-emerald-500 text-white"
                        }`}>
                        {activeArticle.author.role === "doctor" ? t('doctors.doctor') : t('common.lab')}
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black mt-1 leading-snug line-clamp-2">
                        {activeArticle.title}
                      </h2>
                    </div>
                  </div>
                </div>


                <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-4 sm:space-y-6">


                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-border-main/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeArticle.author.avatar}
                        alt={activeArticle.author.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/20 object-cover shrink-0"
                      />
                      <div className="flex flex-col text-right">
                        <span className="text-text-main font-black text-sm sm:text-base">{activeArticle.author.name}</span>
                        <span className="text-text-muted text-xs font-medium">{activeArticle.author.specialty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-text-muted text-xs sm:text-sm font-bold bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-border-main/30 self-start sm:self-auto">
                      <Calendar size={14} />
                      <span>{t('blogs.publishDate')}: {activeArticle.publishDate}</span>
                    </div>
                  </div>

                  <div className="text-text-main text-xs sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-medium text-justify">
                    {activeArticle.content}
                  </div>


                  <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-border-main/50 text-text-muted text-xs sm:text-sm">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 font-bold">
                        <Heart size={16} className="text-red-500/80" />
                        <span>{t('blogs.likesCount', { count: activeArticle.likes })}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <MessageCircle size={16} className="text-blue-500/80" />
                        <span>{t('blogs.commentsCount', { count: activeArticle.comments })}</span>
                      </span>
                    </div>
                  </div>

                </div>


                <div className="px-4 sm:px-8 py-3.5 sm:py-5 bg-gray-50 dark:bg-slate-800/50 border-t border-border-main/50 flex-shrink-0 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-100 dark:bg-slate-700 text-text-muted dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-xs sm:text-sm text-center"
                  >
                    {t('blogs.actions.closeReview')}
                  </button>

                  <div className="flex gap-2 sm:gap-3">
                    {selectedStatus !== "approved" && (
                      <button
                        onClick={() => {
                          setApproveTarget(activeArticle);
                          setIsApproveModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <Check size={16} />
                        <span>{t('blogs.actions.approve')}</span>
                      </button>
                    )}

                    {selectedStatus !== "rejected" && (
                      <button
                        onClick={() => {
                          setRejectTarget(activeArticle);
                          setIsRejectModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <Trash2 size={16} />
                        <span>{t('blogs.actions.reject')}</span>
                      </button>
                    )}
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}


      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectTarget(null);
        }}
        onConfirm={handleRejectConfirm}
        title={t('blogs.rejectModal.title')}
        message={t('blogs.rejectModal.desc', { title: rejectTarget?.title })}
        confirmText={t('blogs.actions.reject')}
        cancelText={t('membership.confirmNo')}
        type="danger"
      />


      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setApproveTarget(null);
        }}
        onConfirm={handleApproveConfirm}
        title={t('blogs.approveModal.title')}
        message={t('blogs.approveModal.desc', { title: approveTarget?.title })}
        confirmText={t('blogs.approveModal.confirm')}
        cancelText={t('membership.confirmNo')}
        type="success"
      />

    </div>
  );
}
