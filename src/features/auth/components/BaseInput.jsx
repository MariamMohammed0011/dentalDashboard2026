import React from 'react';

const BaseInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input 
      ref={ref}
      {...props}
      className={`
        w-full 
        h-[50px] 
        pr-12 
        border border-black/20 
        rounded-[20px] 
        bg-white 
        outline-none 
        focus:ring-2 
        focus:ring-primary/30 
        transition-all 
        text-right 
        ${className || ''}
      `}
    />
  );
});

BaseInput.displayName = 'BaseInput';

export default BaseInput;
