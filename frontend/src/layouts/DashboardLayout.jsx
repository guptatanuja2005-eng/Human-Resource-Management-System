import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  // Get matching page title from route path
  const getPageTitle = (pathname) => {
    if (pathname.includes('/employee/dashboard')) return 'Employee Dashboard';
    if (pathname.includes('/admin/dashboard')) return 'Admin Control Center';
    if (pathname.includes('/profile')) return 'Employee Profile';
    if (pathname.includes('/attendance')) return 'Attendance Records';
    if (pathname.includes('/leave')) return 'Leave & Time Off';
    if (pathname.includes('/payroll')) return 'Payroll Slips';
    return 'Dashboard';
  };
  const title = getPageTitle(location.pathname);
  return (
    <div className="min-h-screen bg-slate-950 flex w-full overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(true)} title={title} />
        {/* View Content Port */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 animate-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
