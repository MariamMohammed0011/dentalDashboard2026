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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(i)}
          className={`w-12 h-12 rounded-2xl text-lg font-black transition-all duration-300 ${
            page === i
              ? 'bg-primary text-white shadow-[0_10px_20px_rgba(54,122,255,0.4)] border-none'
              : 'text-gray-400 hover:text-primary hover:bg-primary/5 border border-transparent'
          }`}
        >
          {i}
        </motion.button>
      );
    }
    if (totalPages > 5) {
       pages.push(<span key="dots" className="text-gray-400 px-4 font-black text-xl">...</span>);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-6 mt-16 pb-10" dir="rtl">
      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-12 h-12 rounded-2xl bg-white text-gray-800 shadow-sm flex items-center justify-center border border-gray-100 disabled:opacity-20 disabled:cursor-not-allowed hover:text-primary transition-colors"
      >
        <ChevronRight size={28} strokeWidth={3} />
      </motion.button>

      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-12 h-12 rounded-2xl bg-white text-gray-800 shadow-sm flex items-center justify-center border border-gray-100 disabled:opacity-20 disabled:cursor-not-allowed hover:text-primary transition-colors"
      >
        <ChevronLeft size={28} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

export default MembershipPagination;
