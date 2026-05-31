// ================================
// MARKETS PAGE
// ================================

import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';

export default function MarketsPage() {
  const { markets, fetchMarkets } = useTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const filtered = markets
    .filter(m => m.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.symbol.localeCompare(b.symbol);
      if (sortBy === 'price') return b.currentPrice - a.currentPrice;
      if (sortBy === 'change') return b.percentChange - a.percentChange;
      return 0;
    });

  const toggleFavorite = (symbol) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Markets</h1>
        <p className="text-slate-300">Monitor cryptocurrencies and forex pairs in real-time</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search coins or pairs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-slate-400"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="change">Sort by Change</option>
        </select>
      </div>

      {/* Markets Table */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-slate-300 text-sm">
                <th className="px-6 py-4 text-left font-semibold">Coin</th>
                <th className="px-6 py-4 text-right font-semibold">Price</th>
                <th className="px-6 py-4 text-right font-semibold">24h Change</th>
                <th className="px-6 py-4 text-right font-semibold">Market Cap</th>
                <th className="px-6 py-4 text-right font-semibold">Volume</th>
                <th className="px-6 py-4 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(market => (
                <tr key={market.symbol} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {market.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{market.symbol}</p>
                        <p className="text-xs text-slate-400">{market.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-white">
                      ${market.currentPrice?.toFixed(2) || 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {market.percentChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={market.percentChange >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {market.percentChange?.toFixed(2) || '0.00'}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300 text-sm">
                    ${market.marketCap ? (market.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300 text-sm">
                    ${market.volume24h ? (market.volume24h / 1e6).toFixed(2) + 'M' : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleFavorite(market.symbol)}
                      className={`p-2 rounded-lg transition ${
                        favorites.includes(market.symbol)
                          ? 'text-yellow-400'
                          : 'text-slate-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star size={18} fill={favorites.includes(market.symbol) ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No markets found matching your search.</p>
        </div>
      )}
    </div>
  );
}
