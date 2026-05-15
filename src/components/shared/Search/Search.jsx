import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

/**
 * Reusable Search component with premium design.
 * 
 * @param {Object} props
 * @param {string} props.value - Current search value.
 * @param {function} props.onChange - Callback when search value changes.
 * @param {string} [props.placeholder='بحث...'] - Input placeholder.
 * @param {string|number} [props.width='100%'] - Component width.
 * @param {string|number} [props.height='45px'] - Component height.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {function} [props.onClear] - Optional callback when clear button is clicked.
 */
const Search = ({ 
  value, 
  onChange, 
  placeholder = 'بحث...', 
  width = '100%', 
  height = '45px',
  className = '',
  onClear
}) => {
  return (
    <div 
      className={`relative group transition-all duration-300 w-full ${className}`}
      style={{ maxWidth: width }}
      dir="rtl"
    >
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-transparent shadow-sm hover:shadow-md focus:shadow-lg rounded-full pr-10 sm:pr-11 pl-4 focus:outline-none focus:ring-4 focus:ring-primary/10 text-[13px] sm:text-[14px] font-medium text-text-main placeholder-gray-400 transition-all duration-300"
        style={{ height }}
      />
      
      {/* Search Icon */}
      <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-300">
        <SearchIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
      </div>

      {/* Clear Button */}
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
          title="مسح البحث"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Search;
