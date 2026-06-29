import React, { useState } from 'react';
import MembershipCard from './MembershipCard';
import MembershipPagination from './MembershipPagination';

const MembershipList = ({ requests, isLoading, onUpdateStatus, onShowDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse" dir="rtl">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-white/50 rounded-[2rem] border border-gray-100" />
        ))}
      </div>
    );
  }

  
  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/30 rounded-[2rem] border border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">لا توجد طلبات انتساب حالياً</p>
      </div>
    );
  }

  /* ───── منطق الباجينيشن (Pagination Logic) ───── */
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = requests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full flex flex-col pb-10" dir="rtl">
      
      {/* ── شبكة الكروت ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentItems.map((request) => (
          <MembershipCard
            key={request.id}
            request={request}
            // تمرير الدالات لمعالجة التحديث وعرض التفاصيل
            onUpdateStatus={onUpdateStatus}
            onShowDetails={onShowDetails} 
          />
        ))}
      </div>

      {/* ── وحدة التحكم بالصفحات ── */}
      {totalPages > 1 && (
        <MembershipPagination
          pagination={{ page: currentPage, totalPages }}
          onPageChange={(newPage) => {
            setCurrentPage(newPage);
            // اختيارياً: التمرير لأعلى الصفحة عند تغيير الصفحة
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
};

export default MembershipList;