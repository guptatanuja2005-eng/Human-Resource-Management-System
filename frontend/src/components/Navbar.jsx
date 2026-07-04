import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Bell, LogOut, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
const Navbar = ({ toggleSidebar, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-200 lg:hidden p-1.5 rounded-lg hover:bg-slate-900 border border-slate-800"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-extrabold text-slate-100 tracking-wider uppercase">{title}</h1>
      </div>
      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-900 border border-slate-800/60 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full border border-slate-950"></span>
        </button>
        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-900 border border-slate-800/60 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-500/40 text-primary-300 flex items-center justify-center font-bold text-sm uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <span className="text-sm font-semibold text-slate-300 hidden md:block pr-2">
              {user?.name}
            </span>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 glass-card border border-slate-800 rounded-lg shadow-xl py-1 z-20 animate-scale-in">
                <div className="px-4 py-2 border-b border-slate-800/60">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Logged in as
                  </p>
                  <p className="text-sm font-bold text-slate-200 truncate mt-0.5">{user?.name}</p>
                  <p className="text-[9px] font-extrabold text-primary-400 uppercase tracking-wider mt-0.5">
                    {user?.role}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 transition-colors"
                >
                  <User size={14} />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left border-t border-slate-800/60 font-semibold"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
