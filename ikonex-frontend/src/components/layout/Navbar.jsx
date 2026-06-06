import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 md:hidden"
              >
                {sidebarOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
              <Link
                to="/dashboard"
                className="text-xl font-bold text-indigo-600"
              >
                Ikonex SMS
              </Link>
            </div>

            {user && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <User size={18} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-500 text-xs">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;
