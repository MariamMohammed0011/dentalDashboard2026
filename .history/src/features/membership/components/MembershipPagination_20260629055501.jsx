import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const MembershipPagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 rounded-xl text-[14px] font-bold transition-all duration-300 ${
            page === i
              ? 'bg-primary text-white border-none'
              : 'text-gray-500 hover:text-primary hover:bg-primary/5 border-none'
          }`}
        >
          {i}
        </motion.button>
      );
    }
    if (totalPages > 7) {
       pages.push(<span key="dots" className="text-gray-300 px-2 font-medium">...</span>);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pb-8" dir="rtl">
      {/* زر السابق */}
      <motion.button
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl text-gray-600 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary transition-colors"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </motion.button>

      {/* أرقام الصفحات */}
      <div className="flex items-center gap-1.5">
        {renderPageNumbers()}
      </div>

      {/* زر التالي */}
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl text-gray-600 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary transition-colors"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};

export default MembershipPagination;