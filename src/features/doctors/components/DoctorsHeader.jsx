import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Search from '../../../components/shared/Search/Search';
import { useMembership } from '../../membership/hooks/useMembership';

const DoctorsHeader = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const { requests, isLoading } = useMembership();
  
  // Filter only doctor requests that are pending
  const pendingDoctorRequests = requests.filter(r => r.status === 'pending' && r.type === 'doctor');
  const count = pendingDoctorRequests.length;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-2 px-0 gap-4 w-full" dir="rtl">
      
      {/* Right: Title & Pending Widget */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-700 dark:text-gray-200">
          الاطباء
        </h1>  

        {/* Clickable pending requests card widget */}
        {!isLoading && count > 0 && (
          <div 
            onClick={() => navigate('/dashboard/membership-requests')}
            className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl px-4 py-2 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer group select-none shadow-sm"
          >
            <span className="text-xs font-black text-primary">
              طلبات بانتظار الموافقة
            </span>
            
            <div className="flex items-center gap-3">
              {/* Stacked circles */}
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full border border-white dark:border-slate-900 bg-primary text-[10px] text-white flex items-center justify-center font-black shadow-sm z-30 ring-1 ring-primary/10">
                  +{count}
                </div>
                <div className="w-7 h-7 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 -mr-3 shadow-sm z-20" />
                <div className="w-7 h-7 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 -mr-3 shadow-sm z-10" />
              </div>

              {/* Navigation button */}
              <div className="w-7 h-7 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-350">
                <ChevronLeft size={16} className="group-hover:translate-x-[-2px] transition-transform" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Left: Search bar */}
      <Search 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="بحث.."
        width="320px"
        className="w-full sm:w-[320px]"
        onClear={() => onSearchChange('')}
      />
    </div>
  );
};

export default DoctorsHeader;

