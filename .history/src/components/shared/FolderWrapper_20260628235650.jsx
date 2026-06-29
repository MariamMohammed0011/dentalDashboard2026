import React from 'react';
const FolderWrapper = ({ 
  children, 
  bgColor = "bg-white", 
  isExternal = false,
  cutoutPointA = 40,
  cutoutPointB = 380 
}) => {
   

  return (
    <div className={`flex-grow ${isExternal ? 'w-full h-full lg:mx-6 lg:mt-4 mt-20 mb-0' : 'm-[2px] lg:-mt-[40px] mt-0 lg:h-full h-[calc(100%-4px)]'} relative transition-all duration-300`}>
      
     
      <div 
        className={`${bgColor} dark:bg-bg-card rounded-[2.5rem] relative overflow-hidden path h-full flex flex-col`}
      
      >
       
        <div className={`pt-4 lg:pt-17 relative flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0 min-w-0 ${isExternal ? 'px-4' : 'pr-4 pl-8 sm:pl-10 lg:pr-6 lg:pl-14'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default FolderWrapper;