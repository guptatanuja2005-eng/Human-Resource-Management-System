import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarCheck,
  CreditCard,
  LogOut,
  X,
  ShieldAlert
} from 'lucide-react';
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const menuItems = [
    {
      label: 'Dashboard',
      path: isAdmin ? '/admin/dashboard' : '/employee/dashboard',
      icon: <LayoutDashboard size={16} />
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <Clock size={16} />
    },
    {
      label: 'Leave Requests',
      path: '/leave',
      icon: <CalendarCheck size={16} />
    },
    {
      label: 'Payroll Slips',
      path: '/payroll',
      icon: <CreditCard size={16} />
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: <User size={16} />
    }
  ];
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 glass-panel border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:flex lg:flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-600/30">
              E
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-100 tracking-wide">Portal</span>
              <span className="text-[9px] font-bold text-slate-500 block uppercase -mt-0.5">
                v1.0.0
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-900 border border-slate-800"
          >
            <X size={16} />
          </button>
        </div>
        {/* User Quick Info */}
        <div className="px-6 py-5 border-b border-slate-800/40 bg-slate-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 border border-primary-500/20 text-white flex items-center justify-center font-bold text-base shadow-inner">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-200 truncate">{user?.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                {user?.designation || 'Staff'}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[8.5px] font-black uppercase bg-primary-500/10 text-primary-400 px-1.5 py-0.5 rounded border border-primary-500/20 mt-1">
                  <ShieldAlert size={10} />
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Navigation Menu */}
        <nav className="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group border ${
                  isActive
                    ? 'bg-primary-600/10 border-primary-500/20 text-primary-400 font-bold shadow-sm'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/20">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
