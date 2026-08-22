import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Trash2,
  BookOpen,
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
  MoreVertical,
  Ban
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
  },
  approved: {
    icon: CheckCircle2,
    className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
  },
  rejected: {
    icon: XCircle,
    className: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40",
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
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${pillClassName} ${className || ""}`}>
      <StatusIcon size={11} />
      <span>{label}</span>
    </span>
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
    ? "bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40"
    : "bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${variant === "solid" ? solidStyle : softStyle} ${className || ""}`}>
      <RoleIcon size={11} />
      <span>{isDoctor ? t('doctors.doctor') : t('common.lab')}</span>
    </span>
  );
};

const BlogActionsMenu = ({ isApproved, isRejected, onReview, onApprove, onReject, onDelete, showReview = true }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* زر فتح القائمة */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm ${
          isOpen
            ? "bg-slate-600 dark:bg-slate-600 text-white shadow-md"
            : "bg-slate-400/70 dark:bg-slate-500/70 text-white hover:bg-slate-500 dark:hover:bg-slate-600 shadow-sm hover:shadow-md"
        }`}
        title={t("common.more") || "خيارات المقال"}
      >
        <MoreVertical size={15} />
      </button>

      {/* شريط الإجراءات بنمط التولتيب العائم */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-0 top-full mt-1.5 z-50 flex items-center gap-1 bg-slate-900/95 dark:bg-slate-800/95 text-white p-1  shadow-xl backdrop-blur-md border border-slate-700/50"
          >
            {/* سهم التولتيب العلوي */}
            <div className="absolute -top-1 left-2.5 w-2 h-2 bg-slate-900/95 dark:bg-slate-800/95 rotate-45 " />

            {/* مراجعة */}
            {showReview && (
              <button
                type="button"
                title={t("blogs.actions.review") || "مراجعة"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onReview();
                }}
                className="p-1.5 hover:bg-white/15 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Eye size={14} />
              </button>
            )}

            {/* قبول */}
            {!isApproved && !isRejected && (
              <button
                type="button"
                title={t("blogs.actions.approve") || "قبول"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onApprove();
                }}
                className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Check size={14} />
              </button>
            )}

            {/* رفض */}
            {!isApproved && !isRejected && (
              <button
                type="button"
                title={t("blogs.actions.reject") || "رفض"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onReject();
                }}
                className="p-1.5 hover:bg-amber-500/20 rounded-lg text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Ban size={14} />
              </button>
            )}

            {/* خط فاصل صغير */}
            {/* <div className="w-px h-3.5 bg-slate-700 mx-0.5" /> */}

            {/* حذف */}
            <button
              type="button"
              title={t("blogs.actions.delete") || "حذف"}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDelete();
              }}
              className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BlogCardSkeleton = () => (
  <div 
    title="جاري تحميل المقال..." 
    className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col justify-between shadow-xs cursor-wait"
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-slate-200/40 dark:via-slate-700/20 to-transparent pointer-events-none z-10" />

    <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-1/2 h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 shrink-0" />
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-150/50 dark:border-slate-800">
        <div className="w-14 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>

    <div className="p-5 flex flex-col gap-3 flex-grow text-right">
      <div className="w-4/5 h-4.5 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="w-full h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
      <div className="w-3/4 h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
    </div>

    <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800 mt-auto border-t border-slate-100 dark:border-slate-800/60">
      <div className="absolute bottom-3 right-3 w-24 h-7 rounded-xl bg-slate-300/40 dark:bg-slate-700/40 backdrop-blur-xs border border-white/10" />
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

  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId && blogs.length > 0) {
      const target = blogs.find((b) => String(b.id) === String(postId));
      if (target) {
        setActiveArticle(target);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, blogs, setSearchParams, setActiveArticle]);

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
    <div className="px-2 sm:px-6 lg:px-2 pb-10 min-h-full flex flex-col gap-8 text-right font-zain" dir="rtl">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 pt-2">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center">
            <BookOpen size={20} className="text-primary" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
              {t('blogs.headerTitle')}
            </h1>
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

      {/* 2. Stats Grid */}
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

      {/* 3. Filters Section */}
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

      {/* 4. Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <BlogCardSkeleton key={i} />)
        ) : blogs.length > 0 ? (
          blogs.map((blog) => {
            const blogStatus = String(blog.status || selectedStatus || "").toLowerCase();
            const isApproved = blogStatus === "approved";
            const isRejected = blogStatus === "rejected";

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-tl-2xl rounded-br-2xl flex flex-col shadow-xs hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* رأس الكارد */}
                <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                        {blog.author.avatar ? (
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{blog.author.name?.slice(0, 2).toUpperCase() || "DR"}</span>
                        )}
                      </div>

                      <div className="flex flex-col text-right min-w-0 flex-1">
                        <h4 
                          title={blog.author.name}
                          className="text-slate-900 dark:text-white font-extrabold text-sm leading-snug truncate group-hover:text-primary transition-colors"
                        >
                          {blog.author.name}
                        </h4>
                        <span 
                          title={blog.author.specialty}
                          className="text-slate-400 dark:text-slate-400 text-xs font-medium truncate mt-0.5"
                        >
                          {blog.author.specialty }
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 self-start">
                      <BlogActionsMenu
                        isApproved={isApproved}
                        isRejected={isRejected}
                        onReview={() => setActiveArticle(blog)}
                        onApprove={() => {
                          setApproveTarget(blog);
                          setIsApproveModalOpen(true);
                        }}
                        onReject={() => {
                          setRejectTarget(blog);
                          setIsRejectModalOpen(true);
                        }}
                        onDelete={() => {
                          setDeleteTarget(blog);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-150/50 dark:border-slate-800/80">
                    <RoleBadge role={blog.author.role} variant="soft" />
                    <StatusPill status={blog.status} />
                  </div>
                </div>

                {/* جسم الكارد: العنوان والمحتوى */}
                <div
                  className="p-5 flex flex-col gap-2 flex-grow cursor-pointer text-right"
                  onClick={() => setActiveArticle(blog)}
                >
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal">
                    {blog.summary}
                  </p>
                </div>

                {/* صورة المقال */}
                {blog.image && (
                  <div
                    className="relative h-44 w-full overflow-hidden cursor-pointer group/image mt-auto bg-slate-100 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60"
                    onClick={() => setActiveArticle(blog)}
                  >
                    <SensitiveImage
                      src={blog.image}
                      alt={blog.title}
                      isSensitive={blog.isSensitiveRedacted}
                      imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/10 text-xs font-semibold">
                      <Calendar size={12} className="text-white/90" />
                      <span dir="ltr">{blog.publishDate}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 sm:p-16 text-center flex flex-col items-center justify-center gap-4 shadow-xs">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center ring-8 ring-amber-500/5">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('blogs.emptyState.title')}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                {t('blogs.emptyState.desc')}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("all");
              }}
              className="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:bg-primary/90 active:scale-95 transition-all"
            >
              {t('blogs.emptyState.reset')}
            </button>
          </div>
        )}
      </div>

      {/* 5. Pagination */}
      {!isLoading && blogs.length > 0 && (
        <MembershipPagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 6. Active Article Modal */}
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
                className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-tl-3xl rounded-br-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="h-48 sm:h-64 relative bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-b border-slate-100 dark:border-slate-800/80">
                  <SensitiveImage
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    isSensitive={activeArticle.isSensitiveRedacted}
                    imgClassName="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-xl transition-colors backdrop-blur-md border border-white/20 z-50"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>

                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 left-4 sm:left-8 flex justify-between items-end text-white">
                    <div className="flex flex-col text-right gap-1.5 min-w-0 flex-1">
                      <RoleBadge role={activeArticle.author.role} className="self-start" />
                      <h2 className="text-sm sm:text-lg font-bold mt-1 leading-tight line-clamp-3">
                        {activeArticle.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                        {activeArticle.author.avatar ? (
                          <img
                            src={activeArticle.author.avatar}
                            alt={activeArticle.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{activeArticle.author.name?.slice(0, 2).toUpperCase() || "DR"}</span>
                        )}
                      </div>

                      <div className="flex flex-col text-right min-w-0 flex-1">
                        <h4
                          title={activeArticle.author.name}
                          className="text-slate-900 dark:text-white font-extrabold text-sm leading-snug truncate"
                        >
                          {activeArticle.author.name}
                        </h4>
                        <span
                          title={activeArticle.author.specialty}
                          className="text-slate-400 dark:text-slate-400 text-xs font-medium truncate mt-0.5"
                        >
                          {activeArticle.author.specialty }
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 self-start">
                      <BlogActionsMenu
                        isApproved={String(activeArticle.status || "").toLowerCase() === "approved"}
                        isRejected={String(activeArticle.status || "").toLowerCase() === "rejected"}
                        showReview={false}
                        onReview={() => {}}
                        onApprove={() => {
                          setApproveTarget(activeArticle);
                          setIsApproveModalOpen(true);
                        }}
                        onReject={() => {
                          setRejectTarget(activeArticle);
                          setIsRejectModalOpen(true);
                        }}
                        onDelete={() => {
                          setDeleteTarget(activeArticle);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-150/50 dark:border-slate-800/80">
                    <RoleBadge role={activeArticle.author.role} variant="soft" />
                    <StatusPill status={activeArticle.status} />
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold">
                      <Calendar size={13} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-text-main">{activeArticle.publishDate}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-4 sm:space-y-6">

                  {/* {activeArticle.reviewMessage && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border-main/40 flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-text-muted shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-text-muted font-medium leading-relaxed">
                        {activeArticle.reviewMessage}
                      </p>
                    </div>
                  )} */}

                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-wider">
                      {t('blogs.contentSectionLabel')}
                    </span>
                    <div className="text-text-main text-xs sm:text-base leading-relaxed sm:leading-loose whitespace-pre-wrap break-words font-medium text-justify">
                      {activeArticle.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <span dir="ltr" className="text-[10px] sm:text-xs text-text-muted font-bold font-mono">
                      #{activeArticle.id} {t('blogs.postIdLabel')}
                    </span>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modals */}
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