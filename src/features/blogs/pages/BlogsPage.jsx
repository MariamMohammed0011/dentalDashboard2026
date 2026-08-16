import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Trash2,
  BookOpen,
  User,
  FlaskConical,
  Calendar,
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
  LayoutGrid,
  ChevronDown
} from "lucide-react";
import { useBlogs } from "../hooks/useBlogs";
import MembershipPagination from "../../membership/components/MembershipPagination";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import Search from "../../../components/shared/Search/Search";
import CustomSelect from "../../../components/ui/CustomSelect";

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


const SensitiveImage = ({ src, alt, isSensitive, imgClassName }) => {
  const { t } = useTranslation();
  const [isRevealed, setIsRevealed] = useState(false);
  const showBlur = isSensitive && !isRevealed;

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${imgClassName || ""} transition-all duration-300 ${showBlur ? "blur-xl scale-110" : ""}`}
      />
      {showBlur && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsRevealed(true);
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/55 hover:bg-black/65 text-white cursor-pointer transition-colors"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center backdrop-blur-md">
            <Eye size={17} />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold px-3 text-center leading-tight">
            {t('blogs.sensitiveContent.label')}
          </span>
        </button>
      )}
    </>
  );
};

const STATUS_STYLES = {
  pending: {
    icon: Clock,
    className: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
    stripClassName: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-500"
  },
  approved: {
    icon: CheckCircle2,
    className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
    stripClassName: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-500"
  },
  rejected: {
    icon: XCircle,
    className: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40",
    stripClassName: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-500"
  },
};

const useStatusConfig = (status) => {
  const { t } = useTranslation();
  const key = String(status || "").toLowerCase();
  const config = STATUS_STYLES[key] || STATUS_STYLES.pending;
  const label = key === "approved"
    ? t('blogs.tabs.approved')
    : key === "rejected"
      ? t('blogs.tabs.rejected')
      : t('blogs.tabs.pending');
  return { ...config, label };
};

const StatusPill = ({ status, className }) => {
  const { icon: StatusIcon, className: pillClassName, label } = useStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border shrink-0 ${pillClassName} ${className || ""}`}>
      <StatusIcon size={11} />
      <span>{label}</span>
    </span>
  );
};

const StatusStrip = ({ status }) => {
  const { icon: StatusIcon, stripClassName, label } = useStatusConfig(status);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border-r-4 ${stripClassName}`}>
      <StatusIcon size={14} className="shrink-0" />
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
};

const RoleBadge = ({ role, variant = "solid", className }) => {
  const { t } = useTranslation();
  const isDoctor = role === "doctor";
  const RoleIcon = isDoctor ? Stethoscope : FlaskConical;
  const solidStyle = isDoctor
    ? "bg-blue-500/80 text-white border-blue-300/30"
    : "bg-emerald-500/80 text-white border-emerald-300/30";
  const softStyle = isDoctor
    ? "bg-blue-50/50 dark:bg-blue-950/30 text-blue-500 border-blue-200/50 dark:border-blue-900/30"
    : "bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-500 border-emerald-200/50 dark:border-emerald-900/30";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-bold border shrink-0 ${variant === "solid" ? solidStyle : softStyle} ${className || ""}`}>
      <RoleIcon size={12} />
      <span>{isDoctor ? t('doctors.doctor') : t('common.lab')}</span>
    </span>
  );
};

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
    handleApproveConfirm,
    deleteTarget,
    setDeleteTarget,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteConfirm
  } = useBlogs();

  const [searchParams, setSearchParams] = useSearchParams();

  // فتح مراجعة المدونة تلقائياً عند الوصول من إشعار "طلب موافقة" عبر ?postId=
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId && blogs.length > 0) {
      const target = blogs.find((b) => String(b.id) === String(postId));
      if (target) {
        setActiveArticle(target);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, blogs]);

  const roleOptions = [
    { value: 'all', label: t('blogs.tabs.all') },
    { value: 'doctor', label: t('blogs.tabs.doctors') },
    { value: 'lab', label: t('blogs.tabs.labs') },
  ];

  const statusOptions = [
    { value: 'pending', label: t('blogs.tabs.pending') },
    { value: 'approved', label: t('blogs.tabs.approved') },
    { value: 'rejected', label: t('blogs.tabs.rejected') },
  ];

  return (
    <div className="px-4 sm:px-8 lg:px-4 pb-10 min-h-full flex flex-col gap-8 text-right font-zain" dir="rtl">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 pt-2">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center">
            <BookOpen size={28} className="text-primary" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
              {t('blogs.headerTitle')}
            </h1>
            <p className="text-text-muted text-xs sm:text-sm font-bold mt-1">
              {t('blogs.headerDesc')}
            </p>
          </div>
        </div>

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

      <div className="py-2 flex flex-col gap-6">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">

        
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1 font-zain">
              <Filter size={14} className="text-primary" />
              <span>الجهة الناشرة</span>
            </label>
            <CustomSelect
              value={selectedRole}
              onChange={(val) => {
                setSelectedRole(val);
                setCurrentPage(1);
              }}
              options={roleOptions}
            />
          </div>

           <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1 font-zain">
              <Sparkles size={14} className="text-amber-500" />
              <span>حالة النشر والمراجعة</span>
            </label>
            <CustomSelect
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
              options={statusOptions}
            />
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
                <SensitiveImage
                  src={blog.image}
                  alt={blog.title}
                  isSensitive={blog.isSensitiveRedacted}
                  imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                <RoleBadge role={blog.author.role} className="absolute top-3 right-3 sm:top-4 sm:right-4 backdrop-blur-md" />

                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/20 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 border border-white/10">
                  <Calendar size={12} />
                  <span>{blog.publishDate}</span>
                </div>
              </div>


              <div className="p-4 sm:p-6 flex-grow flex flex-col gap-3">

                <div className="flex items-center gap-2.5">
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm object-cover shrink-0"
                  />
                  <div className="flex flex-col text-right min-w-0 flex-1">
                    <span dir="ltr" className="text-right text-text-main font-bold text-sm leading-tight truncate">{blog.author.name}</span>
                    <span className="text-text-muted text-[11px] font-medium leading-none mt-1 truncate">{blog.author.specialty}</span>
                  </div>
                </div>

                <StatusStrip status={blog.status} />

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-text-main font-bold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed line-clamp-2">
                    {blog.summary}
                  </p>
                </div>

                <div className="mt-auto pt-3 sm:pt-4 border-t border-border-main/50 flex items-center justify-center gap-2 sm:gap-2.5">

                  <button
                    onClick={() => setActiveArticle(blog)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 cursor-pointer"
                    title={t('blogs.actions.review')}
                  >
                    <Eye size={15} />
                  </button>

                  {selectedStatus !== "approved" && (
                    <button
                      onClick={() => {
                        setApproveTarget(blog);
                        setIsApproveModalOpen(true);
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 cursor-pointer"
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
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 cursor-pointer"
                      title={t('blogs.actions.reject')}
                    >
                      <X size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setDeleteTarget(blog);
                      setIsDeleteModalOpen(true);
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 cursor-pointer"
                    title={t('blogs.actions.delete')}
                  >
                    <Trash2 size={15} />
                  </button>

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
                  <SensitiveImage
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    isSensitive={activeArticle.isSensitiveRedacted}
                    imgClassName="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />


                  <button
                    onClick={() => setActiveArticle(null)}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-2.5 bg-black/30 hover:bg-black/50 text-white rounded-xl transition-colors backdrop-blur-md border border-white/10"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>


                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 left-4 sm:left-8 flex justify-between items-end text-white">
                    <div className="flex flex-col text-right gap-1.5 min-w-0">
                      <RoleBadge role={activeArticle.author.role} className="self-start" />
                      <h2 className="text-lg sm:text-2xl font-black mt-1 leading-snug line-clamp-2">
                        {activeArticle.title}
                      </h2>
                    </div>
                  </div>
                </div>


                <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-4 sm:space-y-6">


                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-border-main/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={activeArticle.author.avatar}
                        alt={activeArticle.author.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm object-cover shrink-0"
                      />
                      <div className="flex flex-col text-right min-w-0">
                        <span dir="ltr" className="text-right text-text-main font-black text-sm sm:text-base truncate">{activeArticle.author.name}</span>
                        <span className="text-text-muted text-xs font-medium truncate">{activeArticle.author.specialty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                      <StatusPill status={activeArticle.status} />
                      <div className="flex items-center gap-1.5 text-text-muted text-xs sm:text-sm font-bold bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-border-main/30">
                        <Calendar size={14} />
                        <span>{t('blogs.publishDate')}: {activeArticle.publishDate}</span>
                      </div>
                    </div>
                  </div>

                  {activeArticle.reviewMessage && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border-main/40 flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-text-muted shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-text-muted font-medium leading-relaxed">
                        {activeArticle.reviewMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-wider">
                      {t('blogs.contentSectionLabel')}
                    </span>
                    <div className="text-text-main text-xs sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-medium text-justify">
                      {activeArticle.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <span dir="ltr" className="text-[10px] sm:text-xs text-text-muted font-bold font-mono">
                      #{activeArticle.id} {t('blogs.postIdLabel')}
                    </span>
                  </div>

                </div>


                <div className="px-4 sm:px-8 py-3.5 sm:py-5 bg-gray-50 dark:bg-slate-800/50 border-t border-border-main/50 flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                  {selectedStatus !== "approved" && (
                    <button
                      onClick={() => {
                        setApproveTarget(activeArticle);
                        setIsApproveModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none sm:min-w-[140px] px-5 sm:px-8 py-2.5 sm:py-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
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
                      className="flex-1 sm:flex-none sm:min-w-[140px] px-5 sm:px-8 py-2.5 sm:py-3 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <XCircle size={16} />
                      <span>{t('blogs.actions.reject')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setDeleteTarget(activeArticle);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none sm:min-w-[140px] px-5 sm:px-8 py-2.5 sm:py-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span>{t('blogs.actions.delete')}</span>
                  </button>
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


      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('blogs.deleteModal.title')}
        message={t('blogs.deleteModal.desc', { title: deleteTarget?.title })}
        confirmText={t('blogs.deleteModal.confirm')}
        cancelText={t('membership.confirmNo')}
        type="danger"
      />

    </div>
  );
}
