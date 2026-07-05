import axiosInstance from "../../../api/axios";

export const blogsApi = {
  
  getBlogs: async ({ search = "", role = "all", status = "pending", page = 1, limit = 6 } = {}) => {
    try {
      let rawPosts = [];

      if (search.trim() !== "") {
        const formData = new FormData();
        formData.append("query", search);

        const response = await axiosInstance.post("/DoctorBlog/search", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const categorizedPosts = response.data?.categorizedPosts || {};
        
        rawPosts = Object.entries(categorizedPosts).flatMap(([categoryKey, postsList]) => {
          return Array.isArray(postsList) ? postsList.map((post) => ({
            ...post,
            postId: post.id, 
            type: categoryKey, 
          })) : [];
        });

        const statusMap = {
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected"
        };
        const targetStatusStr = statusMap[status] || "Pending";
        rawPosts = rawPosts.filter((post) => post.status === targetStatusStr);
      } else {
        const cleanStatus = typeof status === 'string' ? status.toLowerCase() : 'pending';
        let endpoint = "";

        if (cleanStatus === "pending") {
          if (role === "all") endpoint = "/DoctorBlog/all-pending-posts";
          else if (role === "doctor") endpoint = "/DoctorBlog/pending-posts";
          else if (role === "lab") endpoint = "/DoctorBlog/pending-lab-posts";
        } 
        else if (cleanStatus === "approved") {
          if (role === "all") endpoint = "/DoctorBlog/approved-all-posts";
          else if (role === "doctor") endpoint = "/DoctorBlog/approved-doctor-posts";
          else if (role === "lab") endpoint = "/DoctorBlog/approved-lab-posts";
        } 
        else if (cleanStatus === "rejected") {
          if (role === "all") endpoint = "/DoctorBlog/rejected-all-posts";
          else if (role === "doctor") endpoint = "/DoctorBlog/rejected-doctor-posts";
          else if (role === "lab") endpoint = "/DoctorBlog/rejected-lab-posts";
        }

        if (endpoint) {
          const response = await axiosInstance.get(endpoint).catch(() => ({ data: [] }));
          rawPosts = Array.isArray(response.data) ? response.data : [];
        }
      }

      
      let blogs = rawPosts.map((post) => {
        const isLab = post.type?.toLowerCase().includes("lab");
        const roleStr = isLab ? "lab" : "doctor";
        const specialtyStr = isLab ? "مختبر تعويضات سنية" : "أخصائي أسنان";
        
        
        let imageUrl = "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=800&auto=format&fit=crop&q=80";
        if (post.attachments && post.attachments.length > 0) {
          imageUrl = `${axiosInstance.defaults.baseURL.replace("/api", "")}/${post.attachments[0].path}`;
        }

        return {
          id: post.postId,
          title: post.title || "",
          summary: post.content && post.content.length > 150 
            ? post.content.substring(0, 150) + "..." 
            : post.content || "",
          content: post.content || "",
          publishDate: post.createdAt ? post.createdAt.split("T")[0] : "",
          image: imageUrl,
          likes: 0,
          comments: 0,
          author: {
            name: post.authorName || "مستخدم غير معروف",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || "User")}&background=random`,
            role: roleStr,
            specialty: specialtyStr
          },
          status: post.status,
          reviewMessage: post.reviewMessage
        };
      });

      
      if (role !== "all") {
        blogs = blogs.filter((blog) => blog.author.role === role);
      }

      
      const total = blogs.length;
      const start = (page - 1) * limit;
      const paginatedData = blogs.slice(start, start + limit);

      return {
        data: paginatedData,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (error) {
      console.error("Error in getBlogs:", error);
      throw error;
    }
  },

  
  approveBlog: async (id) => {
    const response = await axiosInstance.put(`/DoctorBlog/${id}/approve`);
    return response.data;
  },

  
  rejectBlog: async (id) => {
    const response = await axiosInstance.delete(`/DoctorBlog/${id}/reject`);
    return response.data;
  },

  
  getStats: async () => {
    try {
      const [docsRes, labsRes] = await Promise.all([
        axiosInstance.get("/DoctorBlog/pending-posts").catch(() => ({ data: [] })),
        axiosInstance.get("/DoctorBlog/pending-lab-posts").catch(() => ({ data: [] }))
      ]);
      const docsPosts = Array.isArray(docsRes.data) ? docsRes.data : [];
      const labsPosts = Array.isArray(labsRes.data) ? labsRes.data : [];
      
      return {
        total: docsPosts.length + labsPosts.length,
        doctorCount: docsPosts.length,
        labCount: labsPosts.length,
      };
    } catch (error) {
      console.error("Error in getStats:", error);
      return {
        total: 0,
        doctorCount: 0,
        labCount: 0
      };
    }
  }
};
