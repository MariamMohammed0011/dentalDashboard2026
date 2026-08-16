import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  Zap
} from 'lucide-react';

const UsersTable = ({
  users,
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
    <div className="bg-transparent rounded-2xl overflow-hidden flex-grow flex flex-col space-y-4">

    
      <div className="bg-white dark:bg-bg-card border border-border-main/50 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 sm:mb-0">
          <Filter size={16} className="text-primary shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-text-muted">{t('ads.usersTable.filtersLabel')}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
        
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main'
              }`}
            >
              {t('ads.usersTable.filterAllUsers')}
            </button>
            <button
              onClick={() => setRoleFilter('ADSClient')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === 'ADSClient'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              {t('ads.usersTable.filterAdsClients')}
            </button>
            <button
              onClick={() => setRoleFilter('Dentist')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === 'Dentist'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              {t('ads.usersTable.filterDoctors')}
            </button>
            <button
              onClick={() => setRoleFilter('Lab')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === 'Lab'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {t('ads.usersTable.filterLabs')}
            </button>
          </div>

          {/* Ads Filter */}
          <div className="flex flex-wrap gap-2 border-l border-l-border-main/30 pl-2 ml-2">
            <button
              onClick={() => setAdsFilter('all')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                adsFilter === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main'
              }`}
            >
              {t('ads.usersTable.adsFilterAll')}
            </button>
            <button
              onClick={() => setAdsFilter('active')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                adsFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <Zap size={12} />
              {t('ads.usersTable.adsFilterActive')}
            </button>
            <button
              onClick={() => setAdsFilter('inactive')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                adsFilter === 'inactive'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              {t('ads.usersTable.adsFilterNone')}
            </button>
          </div>
        </div>
      </div>

     
      <div className="hidden lg:block overflow-x-auto custom-scrollbar border border-border-main/50 rounded-2xl bg-white dark:bg-bg-card shadow-sm">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-border-main/30 text-text-muted font-bold text-xs bg-slate-50/80 dark:bg-slate-800/40">
              <th className="py-4 px-4 text-right font-bold">{t('ads.usersTable.colClient')}</th>
              <th className="py-4 px-4 text-right font-bold">{t('ads.usersTable.colFacility')}</th>
              <th className="py-4 px-4 text-right font-bold">{t('ads.usersTable.colContact')}</th>
              <th className="py-4 px-4 text-center font-bold">{t('ads.usersTable.colAds')}</th>
              <th className="py-4 px-4 text-center font-bold">{t('ads.usersTable.colActions')}</th>
               <th className="py-4 px-4 text-center font-bold">{t('ads.usersTable.colActions')}</th>
            
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/20">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="py-4 px-4">
                    <div className="h-10 bg-bg-main/30 rounded-xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-text-muted font-bold">
                  <Users size={40} className="mx-auto mb-2 text-text-muted/40" />
                  {t('ads.usersTable.noResults')}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const hasAds = (user.advertisementsCount || 0) > 0;
                const isAdsClient = user.role === 'ADSClient';

                return (
                  <tr key={user.id} className="hover:bg-primary/3 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                          {user.name?.charAt(0) || <Users size={14} />}
                        </div>
                        <div className="text-right min-w-0">
                          <p className="font-bold text-text-main text-sm truncate">{user.name || t('ads.noName')}</p>
                          <p className="text-xs text-text-muted">#{user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <p className="font-bold text-text-main text-sm truncate">{user.namePlace || "—"}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="shrink-0" />
                          {user.cityPlace || t('ads.notSpecified')}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-sm font-bold text-text-main dir-ltr">{user.phone || "—"}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50/80 dark:bg-slate-800/30 px-3 py-1.5 rounded-lg">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          hasAds
                            ? 'bg-emerald-500/20 text-emerald-600'
                            : 'bg-slate-300/30 text-slate-500'
                        }`}>
                          {hasAds ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                        </div>
                        <span className={`text-xs font-black ${hasAds ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {user.advertisementsCount || 0}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewClick(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                          title={t('common.view')}
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() => onEditClick(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                          title={t('common.edit')}
                        >
                          <Pencil size={13} />
                        </button>

                      

                        <button
                          onClick={() => onAddAdClick(user)}
                          className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <Plus size={12} />
                          {t('common.add')}
                        </button>
                      </div>
                    </td>
                     <td className="py-3.5 px-4">
  {isAdsClient && (
                          <button
                            onClick={() => onDeleteClick(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                            title={t('common.delete')}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                     </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {isLoading ? (
          <div className="grid gap-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-bg-main/30 p-4 rounded-xl animate-pulse h-[120px]" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-text-muted font-bold">
            <Users size={40} className="mx-auto mb-2 text-text-muted/40" />
            {t('ads.usersTable.noResults')}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const hasAds = (user.advertisementsCount || 0) > 0;
            const isAdsClient = user.role === 'ADSClient';

            return (
              <div key={user.id} className="bg-bg-card border border-border-main/40 rounded-xl p-4 space-y-3 hover:shadow-md transition-all">

                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {user.name?.charAt(0) || <Users size={14} />}
                    </div>
                    <div className="text-right min-w-0">
                      <p className="font-bold text-text-main text-sm break-words">{user.name || t('ads.noName')}</p>
                      <p className="text-xs text-text-muted">#{user.id}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg shrink-0 ${
                    hasAds
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-500'
                  }`}>
                    <Zap size={12} />
                    <span className="text-xs font-bold">{user.advertisementsCount || 0}</span>
                  </div>
                </div>

               
                <div className="space-y-2 text-xs border-t border-border-main/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted font-bold">{t('ads.usersTable.mobileFacilityLabel')}</span>
                    <span className="text-text-main font-semibold break-words text-right flex-1">{user.namePlace || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-bold">{t('ads.usersTable.mobilePhoneLabel')}</span>
                    <span className="text-text-main font-semibold dir-ltr">{user.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-bold">{t('ads.usersTable.mobileCityLabel')}</span>
                    <span className="text-text-main font-semibold">{user.cityPlace || "—"}</span>
                  </div>
                </div>

               
                <div className="flex gap-2 pt-2 border-t border-border-main/30">
                  <button
                    onClick={() => onViewClick(user)}
                    className="flex-1 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-600 dark:text-slate-400 transition-all text-xs font-bold py-1.5"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() => onEditClick(user)}
                    className="flex-1 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold py-1.5"
                  >
                    <Pencil size={13} />
                  </button>

                  {isAdsClient && (
                    <button
                      onClick={() => onDeleteClick(user)}
                      className="flex-1 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-bold py-1.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => onAddAdClick(user)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs py-1.5 flex items-center justify-center gap-1"
                  >
                    <Plus size={12} />
                    {t('common.add')}
                  </button>
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