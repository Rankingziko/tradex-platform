// ================================
// TRADEX - Dashboard Page
// ================================

import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, TrendingDown, Activity, Eye, MoreVertical } from 'lucide-react';
import { AuthContext } from '../App';
import axios from 'axios';
import Chart from '../components/Chart';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [cryptoData, setCryptoData] = useState([]);
  const [forexData, setForexData] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('1D');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cryptoRes, forexRes, tradesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/markets/crypto'),
        axios.get('http://localhost:5000/api/markets/forex'),
        axios.get('http://localhost:5000/api/trades', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCryptoData(cryptoRes.data);
      setForexData(forexRes.data);
      setTrades(tradesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2d1b4e] pt-24 pb-32 px-4 md:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Welcome back, <span className="text-[#00ff84]">{user?.username}!</span>
        </h1>
        <p className="text-[#a8adc6] text-lg">Ready to make your next profitable move?</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Total Balance',
            value: `$${user?.balance?.toFixed(2)}`,
            change: '+2.45%',
            icon: Wallet,
            color: 'from-[#2948ff] to-[#4f46e5]'
          },
          {
            title: 'Total P&L',
            value: `$${user?.totalProfit?.toFixed(2)}`,
            change: '+1.32%',
            icon: TrendingUp,
            color: 'from-[#00ff84] to-[#00d4aa]'
          },
          {
            title: 'Open Positions',
            value: trades.filter(t => t.status === 'OPEN').length,
            change: 'Active',
            icon: Activity,
            color: 'from-[#00d4ff] to-[#00b4ff]'
          },
          {
            title: 'Available Margin',
            value: `$${(user?.balance * 0.8)?.toFixed(2)}`,
            change: 'Ready to trade',
            icon: TrendingDown,
            color: 'from-[#4f46e5] to-[#2948ff]'
          }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ translateY: -5 }}
            className="bg-gradient-to-br from-[rgba(26,31,58,0.4)] to-[rgba(41,72,255,0.05)] backdrop-blur-xl border border-[rgba(73,72,255,0.2)] rounded-xl p-6 group cursor-pointer hover:border-[rgba(73,72,255,0.4)] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#a8adc6] text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg opacity-80 group-hover:opacity-100`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-[#00ff84]' : 'text-[#ff6b6b]'}`}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[rgba(26,31,58,0.4)] to-[rgba(41,72,255,0.05)] backdrop-blur-xl border border-[rgba(73,72,255,0.2)] rounded-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Market Overview</h2>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '1Y'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedChart(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChart === period
                    ? 'bg-gradient-to-r from-[#2948ff] to-[#4f46e5] text-white'
                    : 'text-[#a8adc6] hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <Chart period={selectedChart} />
      </motion.div>

      {/* Markets Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crypto Markets */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Top Markets</h2>
          <div className="space-y-3">
            {cryptoData.map((coin, idx) => (
              <motion.div
                key={idx}
                whileHover={{ translateX: 5 }}
                className="bg-gradient-to-br from-[rgba(26,31,58,0.4)] to-[rgba(41,72,255,0.05)] backdrop-blur-xl border border-[rgba(73,72,255,0.2)] rounded-lg p-4 hover:border-[rgba(73,72,255,0.4)] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2948ff] to-[#00d4ff] rounded-full flex items-center justify-center font-bold text-white">
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{coin.name}</p>
                      <p className="text-xs text-[#a8adc6]">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${coin.price.toFixed(2)}</p>
                    <p className={`text-sm font-semibold ${coin.change24h > 0 ? 'text-[#00ff84]' : 'text-[#ff6b6b]'}`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Forex Markets */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Forex Markets</h2>
          <div className="space-y-3">
            {forexData.map((pair, idx) => (
              <motion.div
                key={idx}
                whileHover={{ translateX: 5 }}
                className="bg-gradient-to-br from-[rgba(26,31,58,0.4)] to-[rgba(41,72,255,0.05)] backdrop-blur-xl border border-[rgba(73,72,255,0.2)] rounded-lg p-4 hover:border-[rgba(73,72,255,0.4)] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{pair.pair}</p>
                    <p className="text-xs text-[#a8adc6]">Foreign Exchange</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{pair.price.toFixed(4)}</p>
                    <p className={`text-sm font-semibold ${pair.change24h > 0 ? 'text-[#00ff84]' : 'text-[#ff6b6b]'}`}>
                      {pair.change24h > 0 ? '+' : ''}{pair.change24h}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Trades */}
      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(73,72,255,0.2)]">
                <th className="text-left py-3 px-4 text-[#a8adc6] font-semibold">Pair</th>
                <th className="text-left py-3 px-4 text-[#a8adc6] font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-[#a8adc6] font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-[#a8adc6] font-semibold">Price</th>
                <th className="text-left py-3 px-4 text-[#a8adc6] font-semibold">P&L</th>
                <th className="text-left py-3 px-4 text-[#a8adc6] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, idx) => (
                <tr key={idx} className="border-b border-[rgba(73,72,255,0.1)] hover:bg-[rgba(41,72,255,0.05)]">
                  <td className="py-3 px-4 text-white font-medium">{trade.pair}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      trade.type === 'BUY'
                        ? 'bg-[rgba(0,255,132,0.2)] text-[#00ff84]'
                        : 'bg-[rgba(255,107,107,0.2)] text-[#ff6b6b]'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white">{trade.amount}</td>
                  <td className="py-3 px-4 text-white">${trade.price.toFixed(2)}</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={trade.profit > 0 ? 'text-[#00ff84]' : 'text-[#ff6b6b]'}>
                      ${trade.profit?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${
                      trade.status === 'OPEN'
                        ? 'text-[#00d4ff]'
                        : 'text-[#a8adc6]'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
