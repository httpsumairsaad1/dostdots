import React from 'react';
import { Theme, UserConfig } from '../types';
import WallpaperContent from './WallpaperContent';

interface PhonePreviewProps {
  config: UserConfig;
  theme: Theme;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ config, theme }) => {
  return (
    <div className="relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl shadow-gray-200/50 flex flex-col overflow-hidden ring-1 ring-gray-900/10">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl w-32 mx-auto z-20"></div>
      
      {/* Screen Content */}
      <WallpaperContent config={config} theme={theme} />
      
      {/* Volume Buttons / Power Btn Simulation */}
      <div className="absolute top-24 -left-[10px] w-[2px] h-8 bg-gray-700 rounded-l-md shadow-sm"></div>
      <div className="absolute top-36 -left-[10px] w-[2px] h-12 bg-gray-700 rounded-l-md shadow-sm"></div>
      <div className="absolute top-28 -right-[10px] w-[2px] h-16 bg-gray-700 rounded-r-md shadow-sm"></div>
    </div>
  );
};

export default PhonePreview;