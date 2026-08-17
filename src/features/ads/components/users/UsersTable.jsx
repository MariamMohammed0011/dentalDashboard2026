import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MapPin,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Trash2,
  Pencil,
  Filter,
  Zap,
  Phone,
  Building2,
  Megaphone,
  SlidersHorizontal,
  MoreVertical,
  Stethoscope,
  Layers,
  PowerOff
} from 'lucide-react';

const UserActionsMoreMenu = ({ user, onEditClick, onDeleteClick, isAdsClient }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block text-right"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
        title="المزيد من الإجراءات"
      >
        <MoreVertical size={15} />
      </button>

      {/* Hover Dropdown / Tooltip Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 z-50 min-w-[130px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 font-zain space-y-1"
          >
            {/* Edit Option */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEditClick(user);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
            >
              <Pencil size={13} className="text-blue-500 shrink-0" />
              <span>{t('common.edit') || 'تعديل البيانات'}</span>
            </button>

            {/* Delete Option */}
            {isAdsClient && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDeleteClick(user);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
              >
                <Trash2 size={13} className="text-rose-500 shrink-0" />
                <span>{t('common.delete') || 'حذف المستخدم'}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UsersTable = ({
  users = [],
  isLoading,
  onAddAdClick,
  onViewClick,
  onEditClick,
  onDeleteClick
}) => {
  const { t } = useTranslation();
  const [roleFilter, setRoleFilter] = useState('all');
  const [adsFilter, setAdsFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    const adsMatch =
      adsFilter === 'all' ? true :
      adsFilter === 'active' ? (user.advertisementsCount || 0) > 0 :
      (user.advertisementsCount || 0) === 0;
    return roleMatch && adsMatch;
  });

  return (
    <div className="bg-transparent rounded-2xl overflow-hidden flex-grow flex flex-col space-y-4 font-zain" dir="rtl">
      
      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 font-zain">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Filter size={16} />
          </div>
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wide">
            {t('ads.usersTable.filtersLabel') || 'تصنيف الفئات والأنشطة:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filters Segment */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Users size={13} className="shrink-0" />
              <span>{t('ads.usersTable.filterAllUsers') || 'جميع المستخدمين'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleFilter('ADSClient')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                roleFilter === 'ADSClient'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Megaphone size={13} className="shrink-0" />
              <span>{t('ads.usersTable.filterAdsClients') || 'عملاء الإعلانات'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleFilter('Dentist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                roleFilter === 'Dentist'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Stethoscope size={13} className="shrink-0" />
              <span>{t('ads.usersTable.filterDoctors') || 'الأطباء'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleFilter('Lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                roleFilter === 'Lab'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Building2 size={13} className="shrink-0" />
              <span>{t('ads.usersTable.filterLabs') || 'المخابر'}</span>
            </button>
          </div>

          {/* Ads Activity Filter Segment */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setAdsFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                adsFilter === 'all'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Layers size={13} className="shrink-0" />
              <span>{t('ads.usersTable.adsFilterAll') || 'كل الإعلانات'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAdsFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                adsFilter === 'active'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Zap size={13} className="shrink-0" />
              <span>{t('ads.usersTable.adsFilterActive') || 'نشطة'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAdsFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                adsFilter === 'inactive'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <PowerOff size={13} className="shrink-0" />
              <span>{t('ads.usersTable.adsFilterNone') || 'بدون إعلانات'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-right border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-300">
              <th className="py-4 px-5 text-right w-[24%]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Users size={15} className="text-sky-500" />
                  <span>{t('ads.usersTable.colClient') || 'العميل'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-right w-[24%]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Building2 size={15} className="text-indigo-500" />
                  <span>{t('ads.usersTable.colFacility') || 'المنشأة والمدينة'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-right w-[20%]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Phone size={15} className="text-emerald-500" />
                  <span>{t('ads.usersTable.colContact') || 'التواصل'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-center w-[12%]">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Megaphone size={15} className="text-amber-500" />
                  <span>{t('ads.usersTable.colAds') || 'الإعلانات'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-center w-[20%]">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <SlidersHorizontal size={15} className="text-purple-500" />
                  <span>{t('ads.usersTable.colActions') || 'العمليات'}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="py-4 px-5">
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                  <Users size={40} className="mx-auto mb-2 opacity-30 text-slate-400" />
                  <span>{t('ads.usersTable.noResults') || 'لا يوجد مستخدمين مطابقين للفلتر.'}</span>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const hasAds = (user.advertisementsCount || 0) > 0;
                const isAdsClient = user.role === 'ADSClient';

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-150 group">
                    {/* Client Info */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xs border border-sky-500/20 shrink-0">
                          {user.name?.charAt(0) || <Users size={15} />}
                        </div>
                        <div className="text-right min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate" title={user.name}>
                            {user.name || t('ads.noName') || 'بدون اسم'}
                          </p>
                          <span className="text-[11px] font-mono font-semibold text-slate-400">#{user.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Facility & City */}
                    <td className="py-4 px-5 text-right">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate" title={user.namePlace}>
                          {user.namePlace || "—"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="shrink-0 text-rose-500" />
                          <span>{user.cityPlace || t('ads.notSpecified') || 'غير محدد'}</span>
                        </p>
                      </div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-4 px-5 text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono dir-ltr inline-block">
                        {user.phone || "—"}
                      </span>
                    </td>

                    {/* Ads Count Badge */}
                    <td className="py-4 px-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black shadow-2xs ${
                        hasAds
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}>
                        {hasAds ? (
                          <ArrowUpRight size={13} className="text-emerald-500 shrink-0" />
                        ) : (
                          <ArrowDownLeft size={13} className="text-slate-400 shrink-0" />
                        )}
                        <span>{user.advertisementsCount || 0}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => onViewClick(user)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-slate-600 dark:text-slate-300 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                          title={t('common.view') || 'عرض التفاصيل'}
                        >
                          <Eye size={15} />
                        </button>

                        {/* Add Ad Button */}
                        <button
                          type="button"
                          onClick={() => onAddAdClick(user)}
                          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all duration-200 shadow-xs cursor-pointer active:scale-95 shrink-0"
                        >
                          <Plus size={13} />
                          <span>{t('common.add') || 'إضافة'}</span>
                        </button>

                        {/* More Menu Tooltip (Edit & Delete) */}
                        <UserActionsMoreMenu
                          user={user}
                          onEditClick={onEditClick}
                          onDeleteClick={onDeleteClick}
                          isAdsClient={isAdsClient}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-3">
        {isLoading ? (
          <div className="grid gap-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl animate-pulse h-[120px]" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Users size={40} className="mx-auto mb-2 opacity-30 text-slate-400" />
            <span>{t('ads.usersTable.noResults') || 'لا يوجد مستخدمين مطابقين للفلتر.'}</span>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const hasAds = (user.advertisementsCount || 0) > 0;
            const isAdsClient = user.role === 'ADSClient';

            return (
              <div key={user.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
                {/* Mobile Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xs border border-sky-500/20 shrink-0">
                      {user.name?.charAt(0) || <Users size={15} />}
                    </div>
                    <div className="text-right min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{user.name || t('ads.noName')}</p>
                      <span className="text-[11px] font-mono text-slate-400">#{user.id}</span>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border ${
                    hasAds
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}>
                    <Zap size={12} />
                    <span>{user.advertisementsCount || 0} إعلانات</span>
                  </div>
                </div>

                {/* Mobile Body Info */}
                <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">{t('ads.usersTable.mobileFacilityLabel') || 'المنشأة:'}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[200px]">{user.namePlace || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">{t('ads.usersTable.mobilePhoneLabel') || 'الهاتف:'}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold font-mono dir-ltr">{user.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">{t('ads.usersTable.mobileCityLabel') || 'المدينة:'}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{user.cityPlace || "—"}</span>
                  </div>
                </div>

                {/* Mobile Actions Toolbar */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onViewClick(user)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center shrink-0"
                    title={t('common.view')}
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddAdClick(user)}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs py-2 flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus size={14} />
                    <span>{t('common.add') || 'إضافة إعلان'}</span>
                  </button>

                  <UserActionsMoreMenu
                    user={user}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    isAdsClient={isAdsClient}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default UsersTable;