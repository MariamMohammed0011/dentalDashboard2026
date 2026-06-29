import { useState, useEffect } from "react";
import { toast } from "sonner";
import { blogsApi } from "../services/blogsApi";

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, doctorCount: 0, labCount: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  
  const [activeArticle, setActiveArticle] = useState(null);

  
  const [rejectTarget, setRejectTarget] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  
  const [approveTarget, setApproveTarget] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  
  const fetchBlogsData = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
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
      if (!isSilent) {
        toast.error("فشل في تحميل المقالات، يرجى المحاولة مرة أخرى.");
      }
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, [debouncedSearch, selectedRole, currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBlogsData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [debouncedSearch, selectedRole, currentPage]);

   const handleRejectConfirm = async () => {
    if (!rejectTarget) return;

    try {
      await blogsApi.rejectBlog(rejectTarget.id);
      toast.success(`تم رفض المنشور "${rejectTarget.title}" بنجاح.`);

      // إغلاق المودال التفصيلي في حال كان مفتوحاً
      if (activeArticle && activeArticle.id === rejectTarget.id) {
        setActiveArticle(null);
      }

      // إعادة التحميل وتحديث البيانات
      fetchBlogsData();
    } catch (error) {
      toast.error("فشل في رفض المنشور.");
    } finally {
      setRejectTarget(null);
    }
  };

  // معالجة القبول الفعلي بعد التأكيد
  const handleApproveConfirm = async () => {
    if (!approveTarget) return;

    try {
      await blogsApi.approveBlog(approveTarget.id);
      toast.success(`تم قبول ونشر المقال "${approveTarget.title}" بنجاح.`);

      // إغلاق المودال التفصيلي في حال كان مفتوحاً
      if (activeArticle && activeArticle.id === approveTarget.id) {
        setActiveArticle(null);
      }

      // إعادة التحميل وتحديث البيانات
      fetchBlogsData();
    } catch (error) {
      toast.error("فشل في قبول ونشر المقال.");
    } finally {
      setApproveTarget(null);
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
    fetchBlogsData
  };
};
