
import Navbar from "./Navbar";
import AdminSidebar from "./Sidebar";
import EmployeeSidebar from "./EmployeeSidebar";


const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col ml-64">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;