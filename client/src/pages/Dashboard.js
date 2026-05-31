// ================================
// DASHBOARD PAGE
// ================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, DollarSign, PieChart, Send, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTrading } from '../contexts/TradingContext';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wallets, fetchWallets, markets, fetchMarkets } = useTrading();
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipientType: 'user', // 'user', 'crypto', 'bank'
    recipient: '',
    amount: '',
    currency: 'USD',
    description: ''
  });
  const [users, setUsers] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchWallets();
        await fetchMarkets();
        const deps = await api.getDeposits();
        const withs = await api.getWithdrawals();
        setDeposits(deps.deposits);
        setWithdrawals(withs.withdrawals);
        setStats({ ...deps.stats, ...withs.stats });
        // Load all users for send to user feature
        const usersRes = await api.get('/users');
        setUsers(usersRes.users || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!sendForm.recipient || !sendForm.amount) {
      setSendMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setSendLoading(true);
    setSendMessage('');
    
    try {
      const response = await api.post('/wallet/send', {
        recipientType: sendForm.recipientType,
        recipient: sendForm.recipient,
        amount: parseFloat(sendForm.amount),
        currency: sendForm.currency,
        description: sendForm.description
      });

      setSendMessage({ type: 'success', text: 'Funds sent successfully!' });
      setSendForm({
        recipientType: 'user',
        recipient: '',
        amount: '',
        currency: 'USD',
        description: ''
      });
      
      // Refresh wallets after send
      await fetchWallets();
      
      setTimeout(() => {
        setShowSendModal(false);
      }, 2000);
    } catch (error) {
      setSendMessage({ type: 'error', text: error.response?.data?.error || 'Error sending funds' });
    } finally {
      setSendLoading(false);
    }
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const topGainers = markets
    .filter(m => m.percentChange > 0)
    .sort((a, b) => b.percentChange - a.percentChange)
    .slice(0, 5);
  const topLosers = markets
    .filter(m => m.percentChange < 0)
    .sort((a, b) => a.percentChange - b.percentChange)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.firstName}!</span>
        </h1>
        <p className="text-slate-300">Ready to trade? Monitor your portfolio below.</p>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Balance</p>
              <p className="text-2xl font-bold text-white">${totalBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-cyan-500/20" />
          </div>
        </div>

        {/* Total Deposits */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Deposited</p>
              <p className="text-2xl font-bold text-green-400">${stats.totalDeposits?.toFixed(2) || '0.00'}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Withdrawn</p>
              <p className="text-2xl font-bold text-orange-400">${stats.totalWithdrawals?.toFixed(2) || '0.00'}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-orange-500/20" />
          </div>
        </div>

        {/* Available Margin */}
        <div className="backdrop-blur-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Available Margin</p>
              <p className="text-2xl font-bold text-purple-400">${(totalBalance * 0.7).toFixed(2)}</p>
            </div>
            <Wallet className="w-10 h-10 text-purple-500/20" />
          </div>
        </div>
      </div>

      {/* Wallets Section */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your Wallets</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {wallets.map(wallet => (
            <div
              key={wallet._id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 rounded-xl p-4 hover:border-cyan-500/30 transition"
            >
              <div className="text-lg font-bold text-cyan-400 mb-2">{wallet.currency}</div>
              <div className="text-2xl font-bold text-white">${wallet.balance.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mt-2">Balance: {wallet.currency}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top Gainers
          </h2>
          <div className="space-y-3">
            {topGainers.map(coin => (
              <div key={coin.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div>
                  <p className="font-semibold text-white">{coin.symbol}</p>
                  <p className="text-sm text-slate-400">${coin.currentPrice?.toFixed(2) || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">+{coin.percentChange?.toFixed(2) || '0.00'}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Top Losers
          </h2>
          <div className="space-y-3">
            {topLosers.map(coin => (
              <div key={coin.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div>
                  <p className="font-semibold text-white">{coin.symbol}</p>
                  <p className="text-sm text-slate-400">${coin.currentPrice?.toFixed(2) || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-400">{coin.percentChange?.toFixed(2) || '0.00'}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Trade', color: 'from-cyan-600 to-blue-600', path: '/trading', action: null },
          { label: 'Deposit', color: 'from-green-600 to-emerald-600', path: '/wallet', action: null },
          { label: 'Withdraw', color: 'from-orange-600 to-red-600', path: '/wallet', action: null },
          { label: 'Send', color: 'from-purple-600 to-pink-600', path: null, action: () => setShowSendModal(true) },
          { label: 'History', color: 'from-indigo-600 to-blue-600', path: '/history', action: null },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={() => btn.action ? btn.action() : navigate(btn.path)}
            className={`py-3 px-4 bg-gradient-to-r ${btn.color} text-white font-semibold rounded-lg hover:shadow-lg transition`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* SEND MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Send size={24} className="text-purple-400" />
                Send Funds
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {sendMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                sendMessage.type === 'success'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {sendMessage.text}
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              {/* Recipient Type */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Send To
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'user', label: 'User' },
                    { value: 'crypto', label: 'Crypto' },
                    { value: 'bank', label: 'Bank' }
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSendForm({ ...sendForm, recipientType: type.value, recipient: '' })}
                      className={`py-2 px-3 rounded-lg font-semibold transition ${
                        sendForm.recipientType === type.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Field */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  {sendForm.recipientType === 'user' && 'Select User'}
                  {sendForm.recipientType === 'crypto' && 'Wallet Address'}
                  {sendForm.recipientType === 'bank' && 'Bank Account / Email'}
                </label>
                {sendForm.recipientType === 'user' ? (
                  <select
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  >
                    <option value="">Select a user...</option>
                    {users
                      .filter(u => u._id !== user?._id)
                      .map(u => (
                        <option key={u._id} value={u._id}>
                          {u.email} ({u.firstName} {u.lastName})
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      sendForm.recipientType === 'crypto'
                        ? 'Enter wallet address (Bitcoin, Ethereum, etc.)'
                        : 'Enter bank account number or email'
                    }
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  />
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={sendForm.amount}
                  onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Currency
                </label>
                <select
                  value={sendForm.currency}
                  onChange={(e) => setSendForm({ ...sendForm, currency: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Add a note for this transaction..."
                  value={sendForm.description}
                  onChange={(e) => setSendForm({ ...sendForm, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition font-semibold disabled:opacity-50"
                >
                  {sendLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
