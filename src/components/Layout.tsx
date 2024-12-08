import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useUIStore } from '../store/uiStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed, sidebarWidth, setSidebarWidth } = useUIStore();
  const isDragging = React.useRef(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newWidth = Math.max(64, Math.min(400, e.clientX));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <div 
        style={{ 
          width: isMobile ? '100%' : (isSidebarCollapsed ? '64px' : `${sidebarWidth}px`),
          minWidth: isMobile ? '100%' : (isSidebarCollapsed ? '64px' : `${sidebarWidth}px`),
          height: isMobile ? 'auto' : '100%',
          transition: isSidebarCollapsed ? 'width 0.2s ease-in-out' : 'none'
        }}
        className="flex-shrink-0 z-50"
      >
        <Sidebar />
      </div>
      
      {/* Resize handle - only show on desktop */}
      {!isMobile && !isSidebarCollapsed && (
        <div
          className="w-1 bg-gray-800 hover:bg-primary cursor-col-resize relative z-10"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-2 -right-2" />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;