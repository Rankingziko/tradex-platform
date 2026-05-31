// ================================
// HISTORY PAGE
// ================================

import React, { useState, useEffect } from 'react';
import { Download, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import api from '../services/api';

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('trades');
  const [trades, setTrades] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const [tradesData, depsData, withsData, transData] = await Promise.all([
        api.getTrades(),
        api.getDeposits(),
        api.getWithdrawals(),
        api.getTransfers(),
      ]);

      setTrades(tradesData.trades || []);
      setDeposits(depsData.deposits || []);
      setWithdrawals(withsData.withdrawals || []);
      setTransfers([...(transData.sent || []), ...(transData.received || [])]);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const exportData = (data, filename) => {
    const csv = JSON.stringify(data, null, 2);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">History</h1>
        <button
          onClick={() => exportData(activeTab === 'trades' ? trades : activeTab === 'deposits' ? deposits : withdrawals, activeTab)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {['trades', 'deposits', 'withdrawals', 'transfers'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold text-sm transition ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Trade History */}
      {activeTab === 'trades' && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr className="text-slate-300 text-sm">
                  <th className="px-6 py-4 text-left">Symbol</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-right">Entry</th>
                  <th className="px-6 py-4 text-right">Exit</th>
                  <th className="px-6 py-4 text-right">P/L</th>
                  <th className="px-6 py-4 text-right">Return %</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => (
                  <tr key={trade._id} className="border-b border-white/5 hover:bg-white/5 transition text-sm">
                    <td className="px-6 py-4 font-semibold text-white">{trade.symbol}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">${trade.entryPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">${trade.exitPrice?.toFixed(2) || '-'}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${(trade.profitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${(trade.profitLoss || 0).toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${(trade.profitLossPercentage || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(trade.profitLossPercentage || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(trade.openedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.status === 'closed' ? 'bg-slate-500/20 text-slate-300' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {trades.length === 0 && <div className="text-center py-8 text-slate-400">No trades found</div>}
        </div>
      )}

      {/* Deposit History */}
      {activeTab === 'deposits' && (
        <div className="space-y-3">
          {deposits.map(dep => (
            <div key={dep._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Deposit: {dep.amount} {dep.currency}</p>
                    <p className="text-sm text-slate-400">{new Date(dep.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  dep.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {dep.status}
                </span>
              </div>
            </div>
          ))}
          {deposits.length === 0 && <div className="text-center py-8 text-slate-400">No deposits found</div>}
        </div>
      )}

      {/* Withdrawal History */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-3">
          {withdrawals.map(with_ => (
            <div key={with_._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Withdrawal: {with_.amount} {with_.currency}</p>
                    <p className="text-sm text-slate-400">{new Date(with_.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  with_.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {with_.status}
                </span>
              </div>
            </div>
          ))}
          {withdrawals.length === 0 && <div className="text-center py-8 text-slate-400">No withdrawals found</div>}
        </div>
      )}

      {/* Transfer History */}
      {activeTab === 'transfers' && (
        <div className="space-y-3">
          {transfers.map(transfer => (
            <div key={transfer._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <Download className="w-6 h-6 text-cyan-400 rotate-180" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Transfer: {transfer.amount} {transfer.currency}</p>
                    <p className="text-sm text-slate-400">{new Date(transfer.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded text-sm font-semibold bg-cyan-500/20 text-cyan-400">
                  {transfer.status}
                </span>
              </div>
            </div>
          ))}
          {transfers.length === 0 && <div className="text-center py-8 text-slate-400">No transfers found</div>}
        </div>
      )}
    </div>
  );
}
