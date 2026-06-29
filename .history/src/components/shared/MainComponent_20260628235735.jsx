import React from 'react';
import FolderWrapper from './FolderWrapper';


export default function MainComponent({ children }) {
  return (
    
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      <FolderWrapper bgColor="bg-white" isExternal={true} cutoutPointB={400}>
        
        {/* الطبقة الداخلية (الرمادية #F0F0F0) */}
        {/* لاحظ هنا نغير قيمة cutoutPointB لتقصير أو تطويل الفتحة */}
        <FolderWrapper bgColor="bg-[#F0F0F0]" cutoutPointB={360}>
          
          {/* 
            ✅ تم إزالة absolute/top-0/right-0
            السبب: العناصر absolute لا تُحسب في ارتفاع الـ scroll container
            مما يجعل المحتوى الزائد مقطوعاً وغير قابل للتمرير
          */}
          <div className="w-full h-full bg-transparent">
            {children}
          </div>
          
        </FolderWrapper>

      </FolderWrapper>
    </div>
  );
}