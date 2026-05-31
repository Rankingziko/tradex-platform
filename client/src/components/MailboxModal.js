// ================================
// MAILBOX MODAL COMPONENT (REPORT PROBLEMS)
// ================================

import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function MailboxModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    category: 'technical',
    subject: '',
    message: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'technical', label: '🔧 Technical Issue', icon: 'Zap' },
    { value: 'account', label: '👤 Account Problem', icon: 'User' },
    { value: 'payment', label: '💳 Payment Issue', icon: 'CreditCard' },
    { value: 'trading', label: '📈 Trading Problem', icon: 'TrendingUp' },
    { value: 'security', label: '🔐 Security Concern', icon: 'Lock' },
    { value: 'other', label: '❓ Other', icon: 'HelpCircle' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low - Not urgent' },
    { value: 'medium', label: 'Medium - Normal' },
    { value: 'high', label: 'High - Urgent' },
    { value: 'urgent', label: 'Urgent - Critical' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/reports', formData);
      setMessage({
        type: 'success',
        text: 'Report submitted successfully! Our team will review it shortly.',
      });

      setTimeout(() => {
        setFormData({
          category: 'technical',
          subject: '',
          message: '',
          priority: 'medium',
        });
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error submitting report',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📬 Report a Problem
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Message Alert */}
          {message && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-500/20 border-green-500/30 text-green-300'
                  : 'bg-red-500/20 border-red-500/30 text-red-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Issue Category *
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category: cat.value })
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition text-left ${
                    formData.category === cat.value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              {priorityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Subject *
            </label>
            <input
              type="text"
              placeholder="Brief description of the issue"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Detailed Description *
            </label>
            <textarea
              placeholder="Please describe the issue in detail..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
            />
          </div>

          {/* Help Text */}
          <div className="bg-slate-700/20 border border-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">💡 Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Include specific steps to reproduce the issue</li>
              <li>Mention the device/browser you're using</li>
              <li>Include error messages if applicable</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
