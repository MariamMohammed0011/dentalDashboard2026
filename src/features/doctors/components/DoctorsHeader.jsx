import Search from '../../../components/shared/Search/Search';

const DoctorsHeader = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-5 px-4 sm:px-6 bg-[#F8FAFC]/50 rounded-t-[2rem] border-b border-gray-100/50 gap-4" dir="rtl">
      {/* عنوان الصفحة - يمين */}
      <div className="shrink-0 w-full sm:w-auto text-right">
        <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-700">
          الاطباء
        </h1>  
      </div>
      
      {/* حقل البحث - يسار */}
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
