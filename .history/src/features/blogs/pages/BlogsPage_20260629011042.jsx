import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
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
  Check
} from "lucide-react";
import { useBlogs } from "../hooks/useBlogs";
import MembershipPagination from "../../membership/components/MembershipPagination";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";

// مكون لعرض كارت الإحصائيات الفخم
const BlogStatCard = ({ title, count, icon: Icon, colorClass, gradientClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-bg-card border border-border-main rounded-[2rem] p-6 shadow-sm flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
  >
    <div className="flex flex-col text-right">
      <span className="text-text-muted text-sm font-bold mb-1">{title}</span>
      <span className="text-3xl font-black text-text-main">{count}</span>
    </div>
    <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100 flex items-center justify-center transition-transform duration-300 group-hover:rotate-[10deg]`}>
      <Icon size={24} />
    </div>
    <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
  </motion.div>
);


const BlogCardSkeleton = () => (
  <div className="bg-bg-card border border-border-main rounded-[2rem] overflow-hidden flex flex-col h-[450px] animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full" />
    <div className="p-6 flex-grow flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
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
  const {
    blogs,
    stats,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
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
    <div className="px-4 sm:px-10 lg:px-12 pb-10 min-h-full flex flex-col gap-8 text-right" dir="rtl">
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BlogStatCard
          title="إجمالي المقالات المنشورة"
          count={stats.total}
          icon={BookOpen}
          colorClass="bg-blue-500 text-blue-500"
          gradientClass="from-blue-500 to-indigo-500"
        />
        <BlogStatCard
          title="مقالات الأطباء"
          count={stats.doctorCount}
          icon={User}
          colorClass="bg-amber-500 text-amber-500"
          gradientClass="from-amber-500 to-orange-500"
        />
        <BlogStatCard
          title="مقالات المخابر"
          count={stats.labCount}
          icon={FlaskConical}
          colorClass="bg-emerald-500 text-emerald-500"
          gradientClass="from-emerald-500 to-teal-500"
        />
      </div>

      
      <div className="bg-white dark:bg-bg-card rounded-[2rem] p-6 border border-border-main/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => { setSelectedRole("all"); setCurrentPage(1); }}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              selectedRole === "all"
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            جميع المدونات
          </button>
          <button
            onClick={() => { setSelectedRole("doctor"); setCurrentPage(1); }}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              selectedRole === "doctor"
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            مدونات الأطباء
          </button>
          <button
            onClick={() => { setSelectedRole("lab"); setCurrentPage(1); }}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              selectedRole === "lab"
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            مدونات المخابر
          </button>
        </div>

        {/* مدخل البحث */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
          <input
            type="text"
            placeholder="ابحث بالعنوان، الكاتب، المحتوى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-text-main"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-text-muted/60 hover:text-text-main hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <BlogCardSkeleton key={i} />)
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card border border-border-main rounded-[2rem] overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
            >
              
              <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                
                
                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/10">
                  <Calendar size={12} />
                  <span>{blog.publishDate}</span>
                </div>
              </div>

              
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        className="w-10 h-10 rounded-full border border-primary/10 object-cover"
                      />
                      <div className="flex flex-col text-right">
                        <span className="text-text-main font-bold text-sm leading-tight">{blog.author.name}</span>
                        <span className="text-text-muted text-xs font-medium leading-none mt-1">{blog.author.specialty}</span>
                      </div>
                    </div>

                    
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                      blog.author.role === "doctor"
                        ? "bg-blue-50/50 dark:bg-blue-950/30 text-blue-500 border-blue-200/50 dark:border-blue-900/30"
                        : "bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-500 border-emerald-200/50 dark:border-emerald-900/30"
                    }`}>
                      {blog.author.role === "doctor" ? "طبيب" : "مخبر"}
                    </span>
                  </div>

                  
                  <h3 className="text-text-main font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border-main/50 flex items-center justify-between">
                  
                  
                  <div className="flex gap-4 text-text-muted">
                    <div className="flex items-center gap-1 text-xs">
                      <Heart size={14} className="text-red-500/80 fill-red-500/10" />
                      <span>{blog.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MessageCircle size={14} className="text-blue-500/80" />
                      <span>{blog.comments}</span>
                    </div>
                  </div>

                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveArticle(blog)}
                      className="px-3 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      title="مراجعة التفاصيل"
                    >
                      <Eye size={14} />
                      <span>مراجعة</span>
                    </button>
                    <button
                      onClick={() => {
                        setApproveTarget(blog);
                        setIsApproveModalOpen(true);
                      }}
                      className="p-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-500 rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="قبول المنشور"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setRejectTarget(blog);
                        setIsRejectModalOpen(true);
                      }}
                      className="p-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="رفض المنشور"
                    >
                      <X size={15} />
                    </button>
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
            <h3 className="text-lg font-bold text-text-main">لا توجد منشورات</h3>
            <p className="text-text-muted text-sm max-w-sm">
              لم نجد أي مقالات تطابق خيارات التصفية أو البحث الحالي. يرجى تجربة كلمات بحث أخرى.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("all");
              }}
              className="mt-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              إعادة تعيين الفلاتر
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
                className="relative bg-white dark:bg-bg-card w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                
                
                <div className="h-64 relative bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="absolute top-6 left-6 p-2.5 bg-black/30 hover:bg-black/50 text-white rounded-xl transition-colors backdrop-blur-md border border-white/10"
                  >
                    <X size={20} />
                  </button>

                  
                  <div className="absolute bottom-6 right-8 left-8 flex justify-between items-end text-white">
                    <div className="flex flex-col text-right gap-1">
                      <span className={`self-start px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        activeArticle.author.role === "doctor"
                          ? "bg-blue-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}>
                        {activeArticle.author.role === "doctor" ? "طبيب" : "مخبر"}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black mt-1 leading-snug line-clamp-2">
                        {activeArticle.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* جسم المودال القابل للتمرير */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                  
                  {/* تفاصيل الكاتب */}
                  <div className="flex items-center justify-between pb-6 border-b border-border-main/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeArticle.author.avatar}
                        alt={activeArticle.author.name}
                        className="w-12 h-12 rounded-full border border-primary/20 object-cover"
                      />
                      <div className="flex flex-col text-right">
                        <span className="text-text-main font-black text-base">{activeArticle.author.name}</span>
                        <span className="text-text-muted text-xs font-medium">{activeArticle.author.specialty}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-text-muted text-sm font-bold bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-border-main/30">
                      <Calendar size={14} />
                      <span>تاريخ النشر: {activeArticle.publishDate}</span>
                    </div>
                  </div>

                  {/* نص المقال */}
                  <div className="text-text-main text-sm sm:text-base leading-loose whitespace-pre-line font-medium text-justify">
                    {activeArticle.content}
                  </div>

                  {/* تفاصيل إضافية */}
                  <div className="flex justify-between items-center pt-6 border-t border-border-main/50 text-text-muted text-xs sm:text-sm">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 font-bold">
                        <Heart size={16} className="text-red-500/80" />
                        <span>{activeArticle.likes} إعجاب</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <MessageCircle size={16} className="text-blue-500/80" />
                        <span>{activeArticle.comments} تعليق</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* فوتر المودال الثابت */}
                <div className="px-8 py-5 bg-gray-50 dark:bg-slate-800/50 border-t border-border-main/50 flex-shrink-0 flex justify-between items-center">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-text-muted dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    إغلاق المراجعة
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setApproveTarget(activeArticle);
                        setIsApproveModalOpen(true);
                      }}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      <Check size={16} />
                      <span>قبول المنشور</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setRejectTarget(activeArticle);
                        setIsRejectModalOpen(true);
                      }}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/20 transition-all active:scale-95"
                    >
                      <Trash2 size={16} />
                      <span>رفض المنشور</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* بوب اب تأكيد الرفض */}
      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectTarget(null);
        }}
        onConfirm={handleRejectConfirm}
        title="رفض منشور المدونة"
        message={`هل أنت متأكد من رغبتك في رفض المقال "${rejectTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="رفض المنشور"
        cancelText="تراجع"
        type="danger"
      />

      {/* بوب اب تأكيد القبول */}
      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setApproveTarget(null);
        }}
        onConfirm={handleApproveConfirm}
        title="قبول ونشر المنشور"
        message={`هل أنت متأكد من رغبتك في الموافقة على نشر المقال "${approveTarget?.title}"؟ سيصبح مرئياً للجميع.`}
        confirmText="قبول ونشر"
        cancelText="تراجع"
        type="success"
      />

    </div>
  );
}
