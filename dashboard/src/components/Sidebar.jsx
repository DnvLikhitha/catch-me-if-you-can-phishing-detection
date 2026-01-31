import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, BarChart3, History, GraduationCap, Settings } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/threats', icon: History, label: 'Threat History' },
    { to: '/training', icon: GraduationCap, label: 'Training Mode' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">PhishGuard AI</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Real-Time Protection</p>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
