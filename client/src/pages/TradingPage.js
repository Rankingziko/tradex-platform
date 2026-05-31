// ================================
// TRADING PAGE
// ================================

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, X, Plus } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { useAuth } from '../contexts/AuthContext';

export default function TradingPage() {
  const { trades, wallets, markets, fetchTrades, fetchWallets, placeTrade, closeTrade } = useTrading();
  const { user } = useAuth();
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: 'BTC/USD',
    type: 'buy',
    quantity: 1,
    entryPrice: 45000,
    leverage: 1,
  });

  useEffect(() => {
    fetchTrades();
    fetchWallets();
  }, []);

  const handlePlaceTrade = async (e) => {
    e.preventDefault();
    try {
      await placeTrade(formData);
      setFormData({
        symbol: 'BTC/USD',
        type: 'buy',
        quantity: 1,
        entryPrice: 45000,
        leverage: 1,
      });
      setShowTradeForm(false);
    } catch (error) {
      console.error('Trade error:', error);
    }
  };

  const openTrades = trades.filter(t => t.status === 'open');
  const closedTrades = trades.filter(t => t.status === 'closed');
  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Trading</h1>
        <button
          onClick={() => setShowTradeForm(!showTradeForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
        >
          <Plus size={20} />
          New Trade
        </button>
      </div>

      {/* Trade Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Open Trades</p>
          <p className="text-3xl font-bold text-cyan-400">{openTrades.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Closed Trades</p>
          <p className="text-3xl font-bold text-slate-300">{closedTrades.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Total P/L</p>
          <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Trade Form Modal */}
      {showTradeForm && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Place a Trade</h2>
            <button
              onClick={() => setShowTradeForm(false)}
              className="text-slate-400 hover:text-cyan-400"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handlePlaceTrade} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Symbol */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Symbol</label>
                <select
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                >
                  {['BTC/USD', 'ETH/USD', 'BNB/USD', 'XRP/USD', 'ADA/USD'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Trade Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                >
                  <option value="buy">Buy (Long)</option>
                  <option value="sell">Sell (Short)</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Entry Price ($)</label>
                <input
                  type="number"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })}
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>

              {/* Leverage */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Leverage</label>
                <select
                  value={formData.leverage}
                  onChange={(e) => setFormData({ ...formData, leverage: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                >
                  {[1, 2, 5, 10, 20].map(l => (
                    <option key={l} value={l}>{l}x</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Place Trade
            </button>
          </form>
        </div>
      )}

      {/* Open Trades */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Open Trades</h2>
        <div className="space-y-3">
          {openTrades.length > 0 ? (
            openTrades.map(trade => (
              <div key={trade._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Symbol</p>
                    <p className="text-xl font-bold text-white">{trade.symbol}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Type</p>
                    <div className="flex items-center gap-1">
                      {trade.type === 'buy' ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-bold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Entry Price</p>
                    <p className="text-lg font-bold text-white">${trade.entryPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Quantity</p>
                    <p className="text-lg font-bold text-white">{trade.quantity}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              No open trades. Start trading now!
            </div>
          )}
        </div>
      </div>

      {/* Closed Trades */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Trade History</h2>
        <div className="space-y-3">
          {closedTrades.length > 0 ? (
            closedTrades.map(trade => (
              <div key={trade._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Symbol</p>
                    <p className="text-lg font-bold text-white">{trade.symbol}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Entry</p>
                    <p className="text-lg font-bold text-white">${trade.entryPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Exit</p>
                    <p className="text-lg font-bold text-white">${trade.exitPrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">P/L</p>
                    <p className={`text-lg font-bold ${(trade.profitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${(trade.profitLoss || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Return</p>
                    <p className={`text-lg font-bold ${(trade.profitLossPercentage || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(trade.profitLossPercentage || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{new Date(trade.closedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              No closed trades yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
