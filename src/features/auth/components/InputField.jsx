import React from 'react';

const InputField = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-bold text-gray-700 mr-2">{label}</label>}
      <div className="relative">
        <input 
          {...props}
          className={`w-full h-12 pr-12 rounded-xl border-none bg-white shadow-inner focus:ring-2 focus:ring-primary/50 outline-none transition-all text-right ${props.className || ''}`}
        />
        {Icon && <Icon className="absolute top-1/2 -translate-y-1/2 right-4 text-primary" size={20} />}
      </div>
    </div>
  );
};

export default InputField;
