import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Background */}
      <div className="app-bg" aria-hidden="true" />
      <div className="grid-floor" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true" />

      {/* App shell */}
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
