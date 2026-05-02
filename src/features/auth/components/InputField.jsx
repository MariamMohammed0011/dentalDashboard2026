import React from 'react';
import BaseInput from './BaseInput';

const InputField = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-bold text-gray-700 mr-2">{label}</label>}
      <div className="relative">
        <BaseInput {...props} />
        {Icon && <Icon className="absolute top-1/2 -translate-y-1/2 right-4 text-primary" size={20} />}
      </div>
    </div>
  );
};

export default InputField;
