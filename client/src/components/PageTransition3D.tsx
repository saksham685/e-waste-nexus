import React, { useEffect, useState } from 'react';

interface PageTransition3DProps {
  currentTab: string;
  children: React.ReactNode;
}

export const PageTransition3D: React.FC<PageTransition3DProps> = ({ currentTab, children }) => {
  const [animating, setAnimating] = useState(false);
  const [displayTab, setDisplayTab] = useState(currentTab);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setDisplayTab(currentTab);
      setAnimating(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [currentTab]);

  return (
    <div className="relative w-full overflow-hidden perspective-1200">
      {/* 3D Cyber Warp Scanline Effect on Tab Transition */}
      {animating && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Cyber light beam */}
          <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_30px_#22c55e] animate-cyber-scan" />
          <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] animate-pulse" />
        </div>
      )}

      {/* 3D Page Stage */}
      <div
        key={currentTab}
        className="w-full transition-all duration-500 ease-out animate-page-enter-3d transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
};
