// ================================
// UPDATED LAYOUT WITH ALL NAVIGATION
// ================================

import React, { useState } from 'react';
import { Menu, X, Home, TrendingUp, Wallet, History, Settings, LogOut, Bell, Globe, Users, Zap, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Trading', path: '/trading' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Globe, label: 'Markets', path: '/markets' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const moreItems = [
    { icon: Users, label: 'Referral Program', path: '/referral' },
    { icon: Zap, label: 'VIP Membership', path: '/vip' },
    { icon: Globe, label: 'Support', path: '/support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TRADEX
            </h1>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Premium Trading Platform</p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-white/5'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}

          {/* More Menu */}
          <details className="group">
            <summary className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition list-none">
              <MoreHorizontal size={20} />
              <span>More</span>
            </summary>
            <div className="mt-2 space-y-1 ml-2 pl-4 border-l border-white/10">
              {moreItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-cyan-400 rounded-lg transition text-sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </details>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
            </div>
            <div className="text-sm min-w-0">
              <p className="font-semibold text-white truncate">{user?.firstName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition font-semibold text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-300 hover:text-cyan-400 transition"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1 px-4 md:px-0"></div>

          <button className="relative p-2 text-slate-300 hover:text-cyan-400 transition group">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            <div className="absolute right-0 top-12 bg-slate-900/95 backdrop-blur border border-white/10 rounded-lg w-80 max-h-96 overflow-hidden hidden group-hover:block shadow-xl">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-white/5 hover:bg-white/5 transition">
                  <p className="text-sm text-white font-semibold">Welcome to TRADEX!</p>
                  <p className="text-xs text-slate-400 mt-1">Start trading now</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/5 border-t border-white/10 px-2 py-2 flex items-center justify-around z-50">
        {navItems.slice(0, 5).map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
              isActive(item.path)
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
