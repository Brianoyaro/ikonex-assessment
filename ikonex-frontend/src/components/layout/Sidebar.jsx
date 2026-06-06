import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  BookOpen,
  Award,
  FileText,
  Layers,
  Menu as MenuIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ onClose = () => {} }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/class-streams', label: 'Classes', icon: Layers },
    { path: '/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/assessments', label: 'Assessments', icon: Award },
    { path: '/scores', label: 'Scores', icon: FileText },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col md:relative absolute md:z-0 z-40">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(path)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="text-sm font-medium text-white">
          {user?.firstName} {user?.lastName}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
