import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const AdsFilter = ({ filters, onApplyFilters, onResetFilters }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [approvalStatusFilter, setApprovalStatusFilter] = useState(filters.approvalStatus);
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [typeFilter, setTypeFilter] = useState(filters.type);

  // Sync state if parent filters change (e.g. on reset)
  useEffect(() => {
    setSearchQuery(filters.search);
    setApprovalStatusFilter(filters.approvalStatus);
    setStatusFilter(filters.status);
    setTypeFilter(filters.type);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters({
      search: searchQuery,
      approvalStatus: approvalStatusFilter,
      status: statusFilter,
      type: typeFilter
    });
    toast.success('تمت مواءمة نتائج البحث مع الفلاتر');
  };

  const handleReset = () => {
    setSearchQuery('');
    setApprovalStatusFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    onResetFilters();
    toast.info('تم إعادة تعيين الفلاتر');
  };

  return (
    <div className="bg-white rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        
        {/* Approval Status Filter */}
        <div className="flex flex-col gap-1.5 text-right">
          <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">حالة التأكيد</label>
          <select
            value={approvalStatusFilter}
            onChange={(e) => setApprovalStatusFilter(e.target.value)}
            className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:left_1rem_center] bg-no-repeat pl-10"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 text-right">
          <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">الحالة</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:left_1rem_center] bg-no-repeat pl-10"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>

        {/* Type / Target Audience Filter */}
        <div className="flex flex-col gap-1.5 text-right">
          <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">الجمهور المستهدف</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[position:left_1rem_center] bg-no-repeat pl-10"
          >
            <option value="all">كل الجماهير</option>
            <option value="dentists">أطباء الأسنان فقط</option>
            <option value="labs">مخابر الأسنان فقط</option>
            <option value="both">الأطباء والمخابر معاً</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col gap-1.5 text-right">
          <label className="text-[#367AFF] font-bold text-xs sm:text-sm mr-1">البحث</label>
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في الإعلانات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              className="bg-gray-50/50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full pr-10"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

      </div>

      {/* Buttons (Apply & Reset) */}
      <div className="flex flex-row gap-3 justify-start mt-2">
        <button
          onClick={handleApply}
          className="bg-[#367AFF] text-white hover:bg-[#2563EB] shadow-md shadow-blue-500/10 px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Search size={16} />
          بحث
        </button>
        <button
          onClick={handleReset}
          className="bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <RotateCcw size={16} />
          إعادة تعيين
        </button>
      </div>
    </div>
  );
};

export default AdsFilter;
