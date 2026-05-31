// ================================
// ADMIN PANEL - COMPREHENSIVE DASHBOARD
// ================================

import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, Wallet, TrendingUp, Users, DollarSign, Eye,
  ChevronRight, AlertCircle, Settings, BarChart3, Activity, Zap, Bell, ChevronDown
} from 'lucide-react';
import api from '../services/api';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalDeposits: 0, totalDepositAmount: 0, pendingDeposits: 0 });
  const [loading, setLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState({});
  const [rejectionReason, setRejectionReason] = useState({});
  const [message, setMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionModal, setActionModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionAmount, setActionAmount] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [userActivityData, setUserActivityData] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState(null);
  const [activityTab, setActivityTab] = useState('wallets');
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [allUserLogs, setAllUserLogs] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [logsSearch, setLogsSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'overview' || activeTab === 'deposits') {
      loadStats();
      loadPendingDeposits();
    }
    if (activeTab === 'users') {
      loadUsers();
    }
    if (activeTab === 'logs') {
      loadAllLogs();
    }
    if (activeTab === 'transactions') {
      loadTransactions();
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats/dashboard');
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPendingDeposits = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/deposits/pending');
      setPendingDeposits(response.deposits || []);
    } catch (error) {
      console.error('Error loading deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ type: 'error', text: 'Error loading users' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserActivity = async (userId) => {
    setActivityLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}/activity`);
      setUserActivityData(response);
    } catch (error) {
      console.error('Error loading user activity:', error);
      setMessage({ type: 'error', text: 'Error loading user activity' });
    } finally {
      setActivityLoading(false);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/transactions');
      setTransactions(response.transactions || []);
      setTransactionSummary(response.summary || {});
    } catch (error) {
      console.error('Error loading transactions:', error);
      setMessage({ type: 'error', text: 'Error loading transactions' });
    } finally {
      setLoading(false);
    }
  };

  const loadAllLogs = async () => {
    setActivityLoading(true);
    try {
      const response = await api.get('/admin/all-logs');
      setAllUserLogs(response.userLogs || []);
    } catch (error) {
      console.error('Error loading all logs:', error);
      setMessage({ type: 'error', text: 'Error loading activity logs' });
    } finally {
      setActivityLoading(false);
    }
  };

  const toggleUserExpanded = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleApproveDeposit = async (depositId) => {
    setApprovalLoading({ ...approvalLoading, [depositId]: true });
    try {
      const response = await api.put(`/admin/deposits/${depositId}/approve`, {});
      setMessage({ type: 'success', text: '✓ Deposit approved! User balance updated.' });
      setPendingDeposits(pendingDeposits.filter(d => d._id !== depositId));
      loadStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error approving deposit' });
    } finally {
      setApprovalLoading({ ...approvalLoading, [depositId]: false });
    }
  };

  const handleRejectDeposit = async (depositId) => {
    const reason = rejectionReason[depositId] || 'No reason provided';
    setApprovalLoading({ ...approvalLoading, [depositId]: true });
    try {
      await api.put(`/admin/deposits/${depositId}/reject`, { reason });
      setMessage({ type: 'success', text: '✓ Deposit rejected successfully!' });
      setPendingDeposits(pendingDeposits.filter(d => d._id !== depositId));
      loadStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error rejecting deposit' });
    } finally {
      setApprovalLoading({ ...approvalLoading, [depositId]: false });
    }
  };

  // User Management Handlers
  const handleFreezeAccount = async () => {
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}/freeze`, { freeze: true });
      setMessage({ type: 'success', text: `✓ Account frozen successfully!` });
      setActionModal(null);
      setSelectedUser(null);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error freezing account' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfreezeAccount = async () => {
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}/freeze`, { freeze: false });
      setMessage({ type: 'success', text: `✓ Account unfrozen successfully!` });
      setActionModal(null);
      setSelectedUser(null);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error unfreezing account' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!actionAmount || actionAmount <= 0) {
      setMessage({ type: 'error', text: '✗ Please enter a valid amount' });
      return;
    }
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}/add-funds`, { 
        amount: parseFloat(actionAmount),
        description: actionDescription 
      });
      setMessage({ type: 'success', text: `✓ Added $${actionAmount} to user account!` });
      setActionModal(null);
      setSelectedUser(null);
      setActionAmount('');
      setActionDescription('');
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error adding funds' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFunds = async () => {
    if (!actionAmount || actionAmount <= 0) {
      setMessage({ type: 'error', text: '✗ Please enter a valid amount' });
      return;
    }
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}/remove-funds`, { 
        amount: parseFloat(actionAmount),
        description: actionDescription 
      });
      setMessage({ type: 'success', text: `✓ Removed $${actionAmount} from user account!` });
      setActionModal(null);
      setSelectedUser(null);
      setActionAmount('');
      setActionDescription('');
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error removing funds' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetBalance = async () => {
    if (!actionAmount || actionAmount < 0) {
      setMessage({ type: 'error', text: '✗ Please enter a valid amount' });
      return;
    }
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}/reset-balance`, { 
        newBalance: parseFloat(actionAmount),
        description: actionDescription 
      });
      setMessage({ type: 'success', text: `✓ Balance reset to $${actionAmount}!` });
      setActionModal(null);
      setSelectedUser(null);
      setActionAmount('');
      setActionDescription('');
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || '✗ Error resetting balance' });
    } finally {
      setActionLoading(false);
    }
  };

  const getMethodIcon = (method) => {
    const icons = {
      opay: '💳',
      naira: '₦',
      bank_transfer: '🏦',
      bitcoin: '₿',
      ethereum: 'Ξ',
      usdt_trc20: '🪙',
      usdt_bep20: '🪙',
      bnb: '🔶',
      card: '💳',
    };
    return icons[method] || '💰';
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500',
      confirmed: 'bg-green-500/20 text-green-400 border border-green-500',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500',
      cancelled: 'bg-orange-500/20 text-orange-400 border border-orange-500',
    };
    return statusStyles[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                ⚙️ Admin Control Center
              </h1>
              <p className="text-slate-400">Premium transaction and user management dashboard</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 pb-4 border-b border-cyan-500/20 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview', icon: BarChart3 },
            { id: 'deposits', label: '📥 Deposits', icon: Clock },
            { id: 'withdrawals', label: '📤 Withdrawals', icon: TrendingUp },
            { id: 'users', label: '👥 Users', icon: Users },
            { id: 'transactions', label: '💳 Transactions', icon: DollarSign },
            { id: 'logs', label: '📋 Activity Logs', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg backdrop-blur-sm border animate-in ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-300 border-green-500/50'
              : 'bg-red-500/20 text-red-300 border-red-500/50'
          }`}>
            {message.text}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="group relative bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/60 transition overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-300 text-sm font-medium">Total Deposits</p>
                    <Wallet className="text-blue-400" size={24} />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-1">{stats.totalDeposits}</h3>
                  <p className="text-blue-400 text-sm">Confirmed transactions</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/60 transition overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-300 text-sm font-medium">Total Amount</p>
                    <DollarSign className="text-green-400" size={24} />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-1">${stats.totalDepositAmount.toLocaleString()}</h3>
                  <p className="text-green-400 text-sm">USD equivalent</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/60 transition overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-300 text-sm font-medium">Pending Review</p>
                    <AlertCircle className="text-yellow-400" size={24} />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-1">{stats.pendingDeposits}</h3>
                  <p className="text-yellow-400 text-sm">Awaiting approval</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-300 text-sm font-medium">System Status</p>
                    <Zap className="text-cyan-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-1">Active</h3>
                  <p className="text-cyan-400 text-sm">All systems operational</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap size={24} className="text-yellow-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="group px-4 py-4 bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 transition text-white font-semibold flex items-center justify-center gap-2">
                  <Clock size={20} />
                  <span>View Pending</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                </button>
                <button className="group px-4 py-4 bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20 transition text-white font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  <span>Approve All</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                </button>
                <button className="group px-4 py-4 bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-500/30 rounded-xl hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20 transition text-white font-semibold flex items-center justify-center gap-2">
                  <Users size={20} />
                  <span>Manage Users</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                </button>
                <button className="group px-4 py-4 bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-xl hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 transition text-white font-semibold flex items-center justify-center gap-2">
                  <Activity size={20} />
                  <span>View Logs</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEPOSITS TAB */}
        {activeTab === 'deposits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <Clock size={28} className="text-yellow-400" />
                Pending Deposits ({pendingDeposits.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400">Loading deposits...</p>
              </div>
            ) : pendingDeposits.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                <CheckCircle size={64} className="mx-auto mb-4 text-green-400 opacity-50" />
                <p className="text-2xl font-bold text-white mb-2">All caught up!</p>
                <p className="text-slate-400">No pending deposits require approval</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeposits.map((deposit) => (
                  <div
                    key={deposit._id}
                    className="group bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl p-6 transition overflow-hidden"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">Method</p>
                        <p className="text-white text-lg font-bold mt-1">
                          {getMethodIcon(deposit.method)} {deposit.method.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">Amount</p>
                        <p className="text-white text-lg font-bold mt-1">
                          {deposit.method === 'naira' ? '₦' : '$'}{deposit.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">Currency</p>
                        <p className="text-white text-lg font-bold mt-1">{deposit.currency || 'USD'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">User ID</p>
                        <p className="text-cyan-400 text-sm font-mono mt-1">{deposit.userId.substring(0, 12)}...</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">Date</p>
                        <p className="text-white text-sm mt-1">{new Date(deposit.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">Time</p>
                        <p className="text-white text-sm mt-1">{new Date(deposit.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${getStatusBadge(deposit.status)}`}>
                          {deposit.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {deposit.paymentDetails && (
                      <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/50">
                        <p className="text-slate-300 text-sm font-semibold mb-3">📋 Payment Details</p>
                        <div className="space-y-1 text-slate-300 text-sm">
                          {Object.entries(deposit.paymentDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-mono text-slate-400">{key}:</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason Input */}
                    {!approvalLoading[deposit._id] && (
                      <div className="mb-6">
                        <label className="block text-slate-400 text-sm font-semibold mb-2">Rejection Reason (optional)</label>
                        <textarea
                          placeholder="If rejecting, provide a reason..."
                          value={rejectionReason[deposit._id] || ''}
                          onChange={(e) => setRejectionReason({ ...rejectionReason, [deposit._id]: e.target.value })}
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                          rows="2"
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleRejectDeposit(deposit._id)}
                        disabled={approvalLoading[deposit._id]}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-400 border border-red-500/50 rounded-lg hover:border-red-400/80 hover:shadow-lg hover:shadow-red-500/20 transition disabled:opacity-50 font-semibold"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveDeposit(deposit._id)}
                        disabled={approvalLoading[deposit._id]}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition disabled:opacity-50 font-semibold"
                      >
                        <CheckCircle size={18} />
                        {approvalLoading[deposit._id] ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <Users size={28} className="text-cyan-400" />
                Users Directory ({users.length})
              </h2>
              <input
                type="text"
                placeholder="Search by email or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                <Users size={64} className="mx-auto mb-4 text-slate-400 opacity-50" />
                <p className="text-2xl font-bold text-white mb-2">No Users Found</p>
                <p className="text-slate-400">There are no registered users yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">Email</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">Username</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">Name</th>
                      <th className="px-6 py-4 text-right text-slate-300 font-semibold text-sm">Balance (USD)</th>
                      <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">Wallets</th>
                      <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">Joined</th>
                      <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">Status</th>
                      <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(user => 
                        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map((user) => (
                        <tr 
                          key={user._id}
                          className="border-b border-slate-700/30 hover:bg-slate-800/30 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-300 text-sm">{user.username || '-'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-300 text-sm">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <DollarSign size={16} className="text-green-400" />
                              <span className="font-semibold text-white">
                                {user.balance.toLocaleString('en-US', { 
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                              <Wallet size={14} className="mr-1" />
                              {user.wallets?.length || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-400 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/50">
                                <Zap size={14} />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/50">
                                <CheckCircle size={14} />
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1 flex-wrap">
                              <button
                                onClick={() => { setSelectedUser(user); setActionModal('freeze'); }}
                                title="Freeze account"
                                className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-600/40 transition"
                              >
                                🔒
                              </button>
                              <button
                                onClick={() => { setSelectedUser(user); setActionModal('add'); }}
                                title="Add funds"
                                className="px-2 py-1 text-xs bg-green-600/20 text-green-400 border border-green-500/50 rounded hover:bg-green-600/40 transition"
                              >
                                ➕
                              </button>
                              <button
                                onClick={() => { setSelectedUser(user); setActionModal('remove'); }}
                                title="Remove funds"
                                className="px-2 py-1 text-xs bg-red-600/20 text-red-400 border border-red-500/50 rounded hover:bg-red-600/40 transition"
                              >
                                ➖
                              </button>
                              <button
                                onClick={() => { setSelectedUser(user); setActionModal('reset'); }}
                                title="Reset balance"
                                className="px-2 py-1 text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 rounded hover:bg-yellow-600/40 transition"
                              >
                                🔄
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <Activity size={28} className="text-purple-400" />
                All User Logs ({allUserLogs.length} Users)
              </h2>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by email, name, or username..."
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              />
            </div>

            {activityLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400">Loading activity logs...</p>
              </div>
            ) : allUserLogs.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                <Activity size={64} className="mx-auto mb-4 text-slate-400 opacity-50" />
                <p className="text-2xl font-bold text-white mb-2">No Users Found</p>
                <p className="text-slate-400">No user activity logs available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allUserLogs
                  .filter(userLog =>
                    userLog.user.email.toLowerCase().includes(logsSearch.toLowerCase()) ||
                    (userLog.user.firstName + ' ' + userLog.user.lastName).toLowerCase().includes(logsSearch.toLowerCase()) ||
                    userLog.user.username.toLowerCase().includes(logsSearch.toLowerCase())
                  )
                  .map((userLog) => (
                    <div
                      key={userLog.user._id}
                      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden"
                    >
                      {/* User Header */}
                      <button
                        onClick={() => toggleUserExpanded(userLog.user._id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/70 transition"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div>
                            <p className="text-white font-semibold">{userLog.user.email}</p>
                            <p className="text-slate-400 text-sm">
                              {userLog.user.firstName} {userLog.user.lastName}
                              {userLog.user.username && ` (@${userLog.user.username})`}
                            </p>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-green-400 font-semibold">${userLog.stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-blue-400">{userLog.stats.totalWallets} wallets</span>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-slate-400 transition ${expandedUsers[userLog.user._id] ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Expanded Content */}
                      {expandedUsers[userLog.user._id] && (
                        <div className="px-6 pb-6 border-t border-slate-700/50 space-y-4">
                          {/* Stats Summary */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="bg-slate-900/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs">Trades</p>
                              <p className="text-white font-bold text-lg">{userLog.stats.totalTrades}</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs">Deposits</p>
                              <p className="text-white font-bold text-lg">{userLog.stats.totalDeposits}</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs">Withdrawals</p>
                              <p className="text-white font-bold text-lg">{userLog.stats.totalWithdrawals}</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs">Transfers</p>
                              <p className="text-white font-bold text-lg">{userLog.stats.totalTransfers}</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs">Joined</p>
                              <p className="text-white font-bold text-sm">{new Date(userLog.user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Wallet Balances */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">💰 Wallet Balances</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {userLog.walletBalances.length === 0 ? (
                                <p className="text-slate-400 text-sm">No wallets</p>
                              ) : (
                                userLog.walletBalances.map((wallet, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded-lg p-2 text-sm border border-slate-700/30">
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">{wallet.currency}</span>
                                      <span className="text-green-400 font-semibold">${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                      Deposited: ${wallet.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })} | Withdrawn: ${wallet.totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Trade History */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">📊 Trade History ({userLog.tradeHistory.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.tradeHistory.length === 0 ? (
                                <p className="text-slate-400">No trades</p>
                              ) : (
                                userLog.tradeHistory.slice(0, 5).map((trade, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 text-slate-300">
                                    {trade.pair || trade.symbol} - <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>{trade.type?.toUpperCase()}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Deposit History */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">📥 Deposit History ({userLog.depositHistory.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.depositHistory.length === 0 ? (
                                <p className="text-slate-400">No deposits</p>
                              ) : (
                                userLog.depositHistory.slice(0, 5).map((deposit, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 flex justify-between text-slate-300">
                                    <span>${deposit.amount.toLocaleString()}</span>
                                    <span className={`text-xs px-1 ${
                                      deposit.status === 'confirmed' ? 'text-green-400' :
                                      deposit.status === 'pending' ? 'text-yellow-400' :
                                      'text-red-400'
                                    }`}>{deposit.status?.toUpperCase()}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Withdrawal History */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">📤 Withdrawal History ({userLog.withdrawalHistory.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.withdrawalHistory.length === 0 ? (
                                <p className="text-slate-400">No withdrawals</p>
                              ) : (
                                userLog.withdrawalHistory.slice(0, 5).map((withdrawal, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 flex justify-between text-slate-300">
                                    <span>${withdrawal.amount.toLocaleString()}</span>
                                    <span className={`text-xs px-1 ${
                                      withdrawal.status === 'completed' ? 'text-green-400' :
                                      withdrawal.status === 'pending' ? 'text-yellow-400' :
                                      'text-red-400'
                                    }`}>{withdrawal.status?.toUpperCase()}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Transfer History */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">🔄 Transfer History ({userLog.transferHistory.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.transferHistory.length === 0 ? (
                                <p className="text-slate-400">No transfers</p>
                              ) : (
                                userLog.transferHistory.slice(0, 5).map((transfer, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 text-slate-300">
                                    Transfer on {new Date(transfer.createdAt).toLocaleDateString()}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Login History */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">🔓 Login History ({userLog.loginHistory.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.loginHistory.length === 0 ? (
                                <p className="text-slate-400">No login history</p>
                              ) : (
                                userLog.loginHistory.slice(0, 5).map((login, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 text-slate-300">
                                    {new Date(login.createdAt).toLocaleString()}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Device Activity */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">🖥️ Device Activity ({userLog.deviceActivity.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.deviceActivity.length === 0 ? (
                                <p className="text-slate-400">No device activity</p>
                              ) : (
                                userLog.deviceActivity.slice(0, 5).map((device, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 text-slate-300">
                                    {new Date(device.createdAt).toLocaleString()}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Notifications */}
                          <div>
                            <h4 className="text-white font-semibold mb-2">🔔 Notifications ({userLog.notifications.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                              {userLog.notifications.length === 0 ? (
                                <p className="text-slate-400">No notifications</p>
                              ) : (
                                userLog.notifications.slice(0, 5).map((notif, idx) => (
                                  <div key={idx} className="bg-slate-900/50 rounded px-2 py-1 text-slate-300">
                                    {notif.message || new Date(notif.createdAt).toLocaleString()}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <DollarSign size={28} className="text-cyan-400" />
                All Transactions ({transactionSummary?.totalTransactions || 0})
              </h2>
            </div>

            {/* Summary Cards */}
            {transactionSummary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/60 transition overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-300 text-sm font-medium">Total Deposits</p>
                      <Clock className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{transactionSummary.depositCount}</h3>
                    <p className="text-blue-400 text-sm">${transactionSummary.totalDepositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-orange-900/40 to-orange-800/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/60 transition overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-300 text-sm font-medium">Total Withdrawals</p>
                      <TrendingUp className="text-orange-400" size={24} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{transactionSummary.withdrawalCount}</h3>
                    <p className="text-orange-400 text-sm">${transactionSummary.totalWithdrawalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/60 transition overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-300 text-sm font-medium">Total Trades</p>
                      <BarChart3 className="text-green-400" size={24} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{transactionSummary.tradeCount}</h3>
                    <p className="text-green-400 text-sm">Volume: ${transactionSummary.totalTradeVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filters and Search */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Transaction Type</label>
                  <select
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  >
                    <option value="all">All Transactions</option>
                    <option value="deposit">Deposits Only</option>
                    <option value="withdrawal">Withdrawals Only</option>
                    <option value="trade">Trades Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Search by User or ID</label>
                  <input
                    type="text"
                    placeholder="Search email, name, or transaction ID..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Transactions List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                <DollarSign size={64} className="mx-auto mb-4 text-slate-400 opacity-50" />
                <p className="text-2xl font-bold text-white mb-2">No Transactions Found</p>
                <p className="text-slate-400">There are no transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions
                  .filter(tx => {
                    if (transactionFilter !== 'all' && tx.type !== transactionFilter) return false;
                    if (transactionSearch) {
                      const search = transactionSearch.toLowerCase();
                      return (
                        tx.userEmail.toLowerCase().includes(search) ||
                        tx.userName.toLowerCase().includes(search) ||
                        tx._id.toLowerCase().includes(search) ||
                        tx.pair?.toLowerCase().includes(search)
                      );
                    }
                    return true;
                  })
                  .map((tx) => (
                    <div
                      key={tx._id}
                      className="group bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-4 transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        {/* Type Icon */}
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{tx.icon}</div>
                          <div>
                            <p className="text-white font-semibold text-sm capitalize">{tx.type}</p>
                            {tx.tradeType && <p className="text-slate-400 text-xs">{tx.tradeType.toUpperCase()}</p>}
                          </div>
                        </div>

                        {/* User Info */}
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase">User</p>
                          <p className="text-white text-sm font-medium">{tx.userEmail}</p>
                          <p className="text-slate-500 text-xs">{tx.userName}</p>
                        </div>

                        {/* Amount/Details */}
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase">Amount</p>
                          <p className="text-white text-sm font-semibold">
                            {tx.currency ? `${tx.currency} ` : ''}
                            {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          {tx.pair && <p className="text-slate-500 text-xs">{tx.pair}</p>}
                        </div>

                        {/* Status or Price */}
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase">
                            {tx.status ? 'Status' : 'Price'}
                          </p>
                          {tx.status ? (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              tx.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.status.toUpperCase()}
                            </span>
                          ) : (
                            <p className="text-white text-sm font-semibold">${tx.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          )}
                          {tx.profit !== undefined && (
                            <p className={`text-xs ${tx.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {tx.profit >= 0 ? '+' : ''}{tx.profit.toFixed(2)}%
                            </p>
                          )}
                        </div>

                        {/* Method or Extra Info */}
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase">Method</p>
                          <p className="text-white text-sm">{tx.method ? tx.method.replace('_', ' ').toUpperCase() : tx.currency}</p>
                        </div>

                        {/* Date */}
                        <div className="text-right">
                          <p className="text-slate-400 text-xs font-semibold uppercase">Date</p>
                          <p className="text-white text-sm">{new Date(tx.createdAt).toLocaleDateString()}</p>
                          <p className="text-slate-500 text-xs">{new Date(tx.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* PLACEHOLDER TABS */}
        {['withdrawals'].includes(activeTab) && (
          <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
            <AlertCircle size={64} className="mx-auto mb-4 text-blue-400 opacity-50" />
            <p className="text-2xl font-bold text-white mb-2">Coming Soon</p>
            <p className="text-slate-400">This section is under development</p>
          </div>
        )}
      </div>

      {/* ACTION MODALS */}
      {actionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {actionModal === 'freeze' && '🔒 Freeze Account'}
                {actionModal === 'add' && '➕ Add Funds'}
                {actionModal === 'remove' && '➖ Remove Funds'}
                {actionModal === 'reset' && '🔄 Reset Balance'}
              </h3>
              <button
                onClick={() => { setActionModal(null); setSelectedUser(null); setActionAmount(''); }}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              {selectedUser.email}
            </p>

            {/* Freeze Modal */}
            {actionModal === 'freeze' && (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm mb-4">
                  This will freeze the user's account and prevent them from trading.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setActionModal(null); setSelectedUser(null); }}
                    className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFreezeAccount}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                  >
                    {actionLoading ? 'Freezing...' : 'Freeze'}
                  </button>
                </div>
              </div>
            )}

            {/* Add/Remove/Reset Funds Modals */}
            {['add', 'remove', 'reset'].includes(actionModal) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    {actionModal === 'reset' ? 'New Balance' : 'Amount (USD)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    placeholder="Reason for this action..."
                    rows="2"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                  <p className="text-slate-400 text-xs">Current Balance: <span className="text-white font-semibold">${selectedUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setActionModal(null); setSelectedUser(null); setActionAmount(''); setActionDescription(''); }}
                    className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      actionModal === 'add' ? handleAddFunds :
                      actionModal === 'remove' ? handleRemoveFunds :
                      handleResetBalance
                    }
                    disabled={actionLoading}
                    className={`flex-1 px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 ${
                      actionModal === 'add' ? 'bg-green-600 hover:bg-green-700 text-white' :
                      actionModal === 'remove' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    {actionLoading ? 'Processing...' : (
                      actionModal === 'add' ? 'Add Funds' :
                      actionModal === 'remove' ? 'Remove Funds' :
                      'Reset Balance'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
