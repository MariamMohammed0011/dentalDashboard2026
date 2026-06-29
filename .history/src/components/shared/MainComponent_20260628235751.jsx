import React from 'react';
import FolderWrapper from './FolderWrapper';


export default function MainComponent({ children }) {
  return (
    
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      <FolderWrapper bgColor="bg-white" isExternal={true} cutoutPointB={400}>
                <FolderWrapper bgColor="bg-[#F0F0F0]" cutoutPointB={360}>
          
        
          <div className="w-full h-full bg-transparent">
            {children}
          </div>
          
        </FolderWrapper>

      </FolderWrapper>
    </div>
  );
}