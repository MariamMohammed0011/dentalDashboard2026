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
  const [selectedStatus, setSelectedStatus] = useState("pending"); // "pending" | "approved" | "rejected"
  const [currentPage, setCurrentPage] = useState(1);

  const [activeArticle, setActiveArticle] = useState(null);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [approveTarget, setApproveTarget] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          status: selectedStatus,
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
  }, [debouncedSearch, selectedRole, selectedStatus, currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBlogsData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [debouncedSearch, selectedRole, selectedStatus, currentPage]);

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;

    try {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === rejectTarget.id ? { ...b, status: "rejected" } : b
        )
      );
      if (activeArticle && activeArticle.id === rejectTarget.id) {
        setActiveArticle((prev) => (prev ? { ...prev, status: "rejected" } : null));
      }

      await blogsApi.rejectBlog(rejectTarget.id);
      toast.success(`تم رفض المنشور "${rejectTarget.title}" بنجاح.`);

      fetchBlogsData(true);
    } catch (error) {
      toast.error("فشل في رفض المنشور.");
      fetchBlogsData(true);
    } finally {
      setRejectTarget(null);
    }
  };

  const handleApproveConfirm = async () => {
    if (!approveTarget) return;

    try {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === approveTarget.id ? { ...b, status: "approved" } : b
        )
      );
      if (activeArticle && activeArticle.id === approveTarget.id) {
        setActiveArticle((prev) => (prev ? { ...prev, status: "approved" } : null));
      }

      await blogsApi.approveBlog(approveTarget.id);
      toast.success(`تم قبول ونشر المقال "${approveTarget.title}" بنجاح.`);

      fetchBlogsData(true);
    } catch (error) {
      toast.error("فشل في قبول ونشر المقال.");
      fetchBlogsData(true);
    } finally {
      setApproveTarget(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await blogsApi.deleteBlog(deleteTarget.id);
      toast.success(`تم حذف المقال "${deleteTarget.title}" نهائياً.`);

      if (activeArticle && activeArticle.id === deleteTarget.id) {
        setActiveArticle(null);
      }

      fetchBlogsData();
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
    handleDeleteConfirm,
    fetchBlogsData
  };
};
