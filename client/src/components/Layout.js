// ================================
// LAYOUT COMPONENT
// ================================

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, TrendingUp, Wallet, History, Settings, LogOut, Bell, BarChart3, Zap, User, Edit2, Shield, CreditCard, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import MailboxModal from './MailboxModal';
import api from '../services/api';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [mailboxModalOpen, setMailboxModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileDropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Trading', path: '/trading' },
    { icon: BarChart3, label: 'Markets', path: '/markets' },
    { icon: Zap, label: 'Charts', path: '/charts' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Mail, label: 'Mailbox', path: '/mailbox' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            TRADEX
          </h1>
          <p className="text-xs text-slate-400 mt-1">Premium Trading Platform</p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
          >
            <LogOut size={18} />
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
            className="md:hidden text-slate-300 hover:text-cyan-400"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1 px-4 md:px-0"></div>

          <div className="flex items-center gap-4">
            {/* Report Problem Button */}
            <button
              onClick={() => setMailboxModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-cyan-400 transition"
              title="Report a Problem"
            >
              <Mail size={20} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative p-2 text-slate-300 hover:text-cyan-400 transition"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <NotificationDropdown
                isOpen={notificationDropdownOpen}
                onClose={() => setNotificationDropdownOpen(false)}
              />
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-slate-300 hover:text-cyan-400"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user?.firstName}</span>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl shadow-2xl py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="font-semibold text-white text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition text-sm"
                  >
                    <User size={16} />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/profile-edit');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition text-sm"
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition text-sm"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/security');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition text-sm"
                  >
                    <Shield size={16} />
                    <span>Security</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/wallet');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition text-sm"
                  >
                    <CreditCard size={16} />
                    <span>Payment Methods</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-slate-700/50 my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition text-sm font-semibold"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Mailbox Modal */}
      <MailboxModal
        isOpen={mailboxModalOpen}
        onClose={() => setMailboxModalOpen(false)}
      />
    </div>
  );
}
