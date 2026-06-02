import { useState, useEffect } from "react";
import { toast } from "sonner";
import { blogsApi } from "../services/blogsApi";

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, doctorCount: 0, labCount: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // فلاتر البحث والتصنيف
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // مودال قراءة المقال بالكامل
  const [activeArticle, setActiveArticle] = useState(null);

  // مودال تأكيد الحذف
  const [deleteTarget, setDeleteTarget] = useState(null); // يحمل كائن المنشور المراد حذفه
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // لمنع استدعاء API بشكل متكرر عند كل نقرة زر كيبورد
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // إعادة التعيين للصفحة الأولى عند البحث
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // جلب البيانات
  const fetchBlogsData = async () => {
    setIsLoading(true);
    try {
      const [blogsRes, statsRes] = await Promise.all([
        blogsApi.getBlogs({
          search: debouncedSearch,
          role: selectedRole,
          page: currentPage,
          limit: 6
        }),
        blogsApi.getStats()
      ]);

      setBlogs(blogsRes.data);
      setPagination(blogsRes.pagination);
      setStats(statsRes);
    } catch (error) {
      toast.error("فشل في تحميل المقالات، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, [debouncedSearch, selectedRole, currentPage]);

  // معالجة الحذف الفعلي بعد التأكيد
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await blogsApi.deleteBlog(deleteTarget.id);
      if (res.success) {
        toast.success(`تم حذف مقال "${deleteTarget.title}" بنجاح.`);

        // إغلاق المودال التفصيلي في حال كان مفتوحاً
        if (activeArticle && activeArticle.id === deleteTarget.id) {
          setActiveArticle(null);
        }

        // إعادة التحميل وتحديث البيانات
        fetchBlogsData();
      }
    } catch (error) {
      toast.error("فشل في حذف المقال.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return {
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
    deleteTarget,
    setDeleteTarget,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteConfirm,
    fetchBlogsData
  };
};
