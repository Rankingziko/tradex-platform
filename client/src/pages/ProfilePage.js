// ================================
// PROFILE PAGE
// ================================

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, LogOut, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Header */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-slate-400">{user?.email}</p>
          </div>
          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition">
            <Upload className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Account Information */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Account Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <User className="w-5 h-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="font-semibold text-white">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <Mail className="w-5 h-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-semibold text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <Phone className="w-5 h-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-semibold text-white">{user?.phone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-400">Country</p>
                <p className="font-semibold text-white">{user?.country || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Settings */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-cyan-400" />
          Security
        </h2>
        <div className="space-y-3">
          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left text-white font-semibold transition">
            Change Password
          </button>
          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left text-white font-semibold transition">
            Enable Two-Factor Authentication
          </button>
          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left text-white font-semibold transition">
            View Active Sessions
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}
