import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
