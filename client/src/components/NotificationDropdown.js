// ================================
// NOTIFICATION DROPDOWN COMPONENT
// ================================

import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, TrendingUp, CheckCircle, Clock, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function NotificationDropdown({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read/all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'market':
        return '📈';
      case 'website':
        return '🔔';
      case 'trade':
        return '💱';
      case 'deposit':
        return '💰';
      case 'withdrawal':
        return '💸';
      case 'transfer':
        return '🔄';
      case 'report':
        return '📋';
      case 'alert':
        return '⚠️';
      default:
        return '📬';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'market':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'website':
        return 'bg-purple-500/20 border-purple-500/30';
      case 'trade':
        return 'bg-cyan-500/20 border-cyan-500/30';
      case 'deposit':
        return 'bg-green-500/20 border-green-500/30';
      case 'withdrawal':
        return 'bg-orange-500/20 border-orange-500/30';
      case 'alert':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl shadow-2xl max-h-96 overflow-hidden flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-4 text-center text-slate-400">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`px-4 py-3 border-b border-slate-700/30 hover:bg-white/5 transition cursor-pointer ${
                !notification.read ? 'bg-slate-700/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1">
                  {getNotificationIcon(notification.type)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {notification.title}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        {notification.message}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification._id);
                      }}
                      className="mt-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && unreadCount > 0 && (
        <div className="border-t border-slate-700/50 px-4 py-2">
          <button
            onClick={markAllAsRead}
            className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition font-semibold"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
