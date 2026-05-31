// ================================
// PROFESSIONAL TRADINGVIEW CHARTS PAGE
// ================================

import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Maximize2, Settings } from 'lucide-react';

export default function ChartsPage() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPairSelector, setShowPairSelector] = useState(false);

  // Comprehensive Market Data
  const tradingPairs = [
    // ========== CRYPTOCURRENCIES ==========
    { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'Crypto', price: 67500.50, change: 2.35 },
    { symbol: 'ETHUSDT', name: 'Ethereum', category: 'Crypto', price: 3450.75, change: -1.20 },
    { symbol: 'SOLUSDT', name: 'Solana', category: 'Crypto', price: 142.30, change: 5.67 },
    { symbol: 'ADAUSDT', name: 'Cardano', category: 'Crypto', price: 1.05, change: 3.22 },
    { symbol: 'XRPUSDT', name: 'Ripple', category: 'Crypto', price: 2.85, change: -0.45 },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', category: 'Crypto', price: 0.35, change: 8.90 },
    { symbol: 'LINKUSDT', name: 'Chainlink', category: 'Crypto', price: 28.50, change: 1.75 },
    { symbol: 'LTCUSDT', name: 'Litecoin', category: 'Crypto', price: 95.20, change: -2.10 },
    { symbol: 'DOTUSDT', name: 'Polkadot', category: 'Crypto', price: 8.45, change: 4.32 },
    { symbol: 'UNIUSDT', name: 'Uniswap', category: 'Crypto', price: 12.75, change: 2.85 },
    { symbol: 'AVAXUSDT', name: 'Avalanche', category: 'Crypto', price: 38.90, change: 6.50 },
    { symbol: 'MATICUSDT', name: 'Polygon', category: 'Crypto', price: 0.95, change: 3.45 },
    
    // ========== FOREX PAIRS ==========
    { symbol: 'EURUSD', name: 'EUR/USD', category: 'Forex', price: 1.0950, change: 0.45 },
    { symbol: 'GBPUSD', name: 'GBP/USD', category: 'Forex', price: 1.2680, change: -0.32 },
    { symbol: 'USDJPY', name: 'USD/JPY', category: 'Forex', price: 149.30, change: 0.78 },
    { symbol: 'AUDUSD', name: 'AUD/USD', category: 'Forex', price: 0.6550, change: -0.12 },
    { symbol: 'USDCAD', name: 'USD/CAD', category: 'Forex', price: 1.3620, change: 0.25 },
    { symbol: 'USDCHF', name: 'USD/CHF', category: 'Forex', price: 0.8810, change: -0.18 },
    { symbol: 'NZDUSD', name: 'NZD/USD', category: 'Forex', price: 0.6120, change: 0.55 },
    { symbol: 'EURGBP', name: 'EUR/GBP', category: 'Forex', price: 0.8630, change: 0.65 },
    { symbol: 'EURJPY', name: 'EUR/JPY', category: 'Forex', price: 163.45, change: 0.35 },
    { symbol: 'GBPJPY', name: 'GBP/JPY', category: 'Forex', price: 189.50, change: -0.42 },
    { symbol: 'AUDJPY', name: 'AUD/JPY', category: 'Forex', price: 97.80, change: 1.20 },
    { symbol: 'CADJPY', name: 'CAD/JPY', category: 'Forex', price: 109.75, change: -0.65 },

    // ========== METALS ==========
    { symbol: 'XAUUSD', name: 'Gold', category: 'Metal', price: 2385.50, change: 1.25 },
    { symbol: 'XAGUSD', name: 'Silver', category: 'Metal', price: 28.75, change: 2.35 },
    { symbol: 'XPTUSD', name: 'Platinum', category: 'Metal', price: 1095.30, change: -1.45 },
    { symbol: 'XPDUSD', name: 'Palladium', category: 'Metal', price: 1048.20, change: 0.85 },
    { symbol: 'XCUUSD', name: 'Copper', category: 'Metal', price: 4.35, change: 3.20 },
  ];

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D'];

  // Filter pairs based on search query
  const filteredPairs = tradingPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group pairs by category
  const groupedPairs = {
    Crypto: tradingPairs.filter(p => p.category === 'Crypto'),
    Forex: tradingPairs.filter(p => p.category === 'Forex'),
    Metal: tradingPairs.filter(p => p.category === 'Metal'),
  };

  // Initialize TradingView lightweight charts
  useEffect(() => {
    if (!chartRef.current) {
      loadTradingViewChart();
    }
  }, [selectedPair, timeframe]);

  const loadTradingViewChart = async () => {
    try {
      // Load TradingView lightweight charts library
      if (!window.LightweightCharts) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lightweight-charts@4/dist/lightweight-charts.standalone.production.js';
        script.async = true;
        script.onload = () => {
          initChart();
        };
        document.body.appendChild(script);
      } else {
        initChart();
      }
    } catch (error) {
      console.error('Error loading chart library:', error);
    }
  };

  const initChart = () => {
    if (!containerRef.current || !window.LightweightCharts) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Create chart container
    const container = containerRef.current;
    container.innerHTML = '';

    const { createChart, ColorType } = window.LightweightCharts;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#d1d5db',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      width: container.clientWidth,
      height: container.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString();
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#6b7280',
          width: 8,
          style: 2,
          visible: true,
        },
        horzLine: {
          color: '#6b7280',
          width: 8,
          style: 2,
          visible: true,
        },
      },
      grid: {
        horzLines: { color: '#1e293b', visible: true },
        vertLines: { color: '#1e293b', visible: true },
      },
    });

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#0ea5e9',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      lastValueVisible: false,
      priceLineVisible: false,
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.7, bottom: 0 },
    });

    // Generate mock data based on selected pair and timeframe
    const data = generateChartData(selectedPair, timeframe);
    const volumeData = data.map(bar => ({
      time: bar.time,
      value: Math.random() * 1000000,
      color: bar.close > bar.open ? '#10b981' : '#ef4444',
    }));

    candleSeries.setData(data);
    volumeSeries.setData(volumeData);

    // Handle chart resize
    const handleResize = () => {
      if (container && chartRef.current) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        chart.applyOptions({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Fit content
    chart.timeScale().fitContent();

    chartRef.current = { chart, volumeSeries, candleSeries, resizeObserver };
  };

  const generateChartData = (symbol, tf) => {
    const bars = [];
    const now = Math.floor(Date.now() / 1000);
    const timeMultiplier = {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '1h': 3600,
      '4h': 14400,
      '1D': 86400,
    };

    const interval = timeMultiplier[tf] || 3600;
    const barsCount = 100;

    // Base prices for different assets
    const basePrices = {
      // Cryptocurrencies
      'BTCUSDT': 67500,
      'ETHUSDT': 3450,
      'SOLUSDT': 142,
      'ADAUSDT': 1.05,
      'XRPUSDT': 2.85,
      'DOGEUSDT': 0.35,
      'LINKUSDT': 28.50,
      'LTCUSDT': 95.20,
      'DOTUSDT': 8.45,
      'UNIUSDT': 12.75,
      'AVAXUSDT': 38.90,
      'MATICUSDT': 0.95,
      // Forex
      'EURUSD': 1.0950,
      'GBPUSD': 1.2680,
      'USDJPY': 149.30,
      'AUDUSD': 0.6550,
      'USDCAD': 1.3620,
      'USDCHF': 0.8810,
      'NZDUSD': 0.6120,
      'EURGBP': 0.8630,
      'EURJPY': 163.45,
      'GBPJPY': 189.50,
      'AUDJPY': 97.80,
      'CADJPY': 109.75,
      // Metals
      'XAUUSD': 2385.50,
      'XAGUSD': 28.75,
      'XPTUSD': 1095.30,
      'XPDUSD': 1048.20,
      'XCUUSD': 4.35,
    };

    let price = basePrices[symbol] || 50000;

    for (let i = barsCount; i > 0; i--) {
      const time = (now - i * interval);
      const change = (Math.random() - 0.5) * price * 0.02;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);

      bars.push({
        time,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
      });

      price = close;
    }

    return bars;
  };

  const handleFullscreen = () => {
    const element = containerRef.current;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={32} className="text-cyan-400" />
          Professional Trading Charts
        </h1>
      </div>

      {/* Main Chart Container */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
        {/* Chart Toolbar */}
        <div className="bg-slate-800/80 border-b border-slate-700/50 px-6 py-4 space-y-4">
          {/* Top Row - Pair Selector and Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Market Selector Button */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowPairSelector(!showPairSelector)}
                  className="px-4 py-2 rounded-lg font-semibold bg-cyan-600 text-white hover:bg-cyan-700 transition flex items-center gap-2"
                >
                  <span>{selectedPair}</span>
                  <span className="text-sm">▼</span>
                </button>

                {/* Pair Selector Modal */}
                {showPairSelector && (
                  <div className="absolute top-full mt-2 left-0 w-80 bg-slate-900 border border-slate-700/50 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
                    {/* Search Bar */}
                    <div className="p-3 border-b border-slate-700/50 sticky top-0 bg-slate-800/80">
                      <input
                        type="text"
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>

                    {/* Markets List */}
                    <div className="overflow-y-auto">
                      {searchQuery ? (
                        // Search results
                        <div className="p-2">
                          {filteredPairs.length > 0 ? (
                            filteredPairs.map((pair) => (
                              <button
                                key={pair.symbol}
                                onClick={() => {
                                  setSelectedPair(pair.symbol);
                                  setShowPairSelector(false);
                                  setSearchQuery('');
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition ${
                                  selectedPair === pair.symbol
                                    ? 'bg-cyan-600/30 border border-cyan-500'
                                    : 'hover:bg-slate-700/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-white text-sm">{pair.symbol}</p>
                                    <p className="text-xs text-slate-400">{pair.name}</p>
                                  </div>
                                  <div className={`text-xs font-bold ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {pair.change > 0 ? '+' : ''}{pair.change.toFixed(2)}%
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <p className="text-center text-slate-400 py-4">No results found</p>
                          )}
                        </div>
                      ) : (
                        // Grouped by category
                        Object.entries(groupedPairs).map(([category, pairs]) => (
                          <div key={category}>
                            <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700/50 sticky top-10">
                              <p className="text-xs font-bold uppercase text-cyan-400">{category}</p>
                            </div>
                            {pairs.map((pair) => (
                              <button
                                key={pair.symbol}
                                onClick={() => {
                                  setSelectedPair(pair.symbol);
                                  setShowPairSelector(false);
                                }}
                                className={`w-full text-left px-3 py-2 border-b border-slate-700/30 transition ${
                                  selectedPair === pair.symbol
                                    ? 'bg-cyan-600/30 border-l-2 border-l-cyan-500'
                                    : 'hover:bg-slate-700/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-white text-sm">{pair.symbol}</p>
                                    <p className="text-xs text-slate-400">{pair.name}</p>
                                  </div>
                                  <div className={`text-xs font-bold ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {pair.change > 0 ? '+' : ''}{pair.change.toFixed(2)}%
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Price Info */}
              <div className="border-l border-slate-600 pl-4">
                <p className="text-slate-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-white">
                  ${tradingPairs.find(p => p.symbol === selectedPair)?.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={handleFullscreen}
                className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition"
                title="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
              <button
                className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Bottom Row - Timeframe Selector */}
          <div className="flex gap-2 flex-wrap">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                  timeframe === tf
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div
          ref={containerRef}
          className="w-full h-96 md:h-[600px] bg-slate-900"
          style={{ minHeight: '400px' }}
        />

        {/* Chart Footer - Stats */}
        <div className="bg-slate-800/50 border-t border-slate-700/50 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-xs uppercase">Pair</p>
            <p className="text-white font-semibold">{selectedPair}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase">Category</p>
            <p className="text-cyan-400 font-semibold">{tradingPairs.find(p => p.symbol === selectedPair)?.category}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase">Timeframe</p>
            <p className="text-white font-semibold">{timeframe}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase">24h Change</p>
            <p className={`font-semibold ${
              tradingPairs.find(p => p.symbol === selectedPair)?.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {tradingPairs.find(p => p.symbol === selectedPair)?.change > 0 ? '+' : ''}{tradingPairs.find(p => p.symbol === selectedPair)?.change.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Chart Type', value: 'Candlestick' },
          { label: 'Volume Indicator', value: 'Active' },
          { label: 'Drawing Tools', value: 'Enabled' },
          { label: 'Resolution', value: 'Real-time' },
        ].map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">{item.label}</p>
            <p className="text-lg font-bold text-cyan-400 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">📊 Chart Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Professional candlestick charting with real-time updates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Multiple timeframes: 1m, 5m, 15m, 1h, 4h, 1D</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Volume indicator for market analysis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Dark theme optimized for trading</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Fully responsive and mobile-friendly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Support for 37+ markets including Crypto, Forex & Metals</span>
          </li>
        </ul>

        {/* Market Categories */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h4 className="text-cyan-400 font-bold mb-2">🪙 Cryptocurrencies (12)</h4>
            <p className="text-slate-400 text-xs">Bitcoin, Ethereum, Solana, Cardano, Ripple, Dogecoin, Chainlink, Litecoin, Polkadot, Uniswap, Avalanche, Polygon</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h4 className="text-cyan-400 font-bold mb-2">💱 Forex Pairs (12)</h4>
            <p className="text-slate-400 text-xs">EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, NZD/USD, EUR/GBP, EUR/JPY, GBP/JPY, AUD/JPY, CAD/JPY</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h4 className="text-cyan-400 font-bold mb-2">💎 Precious Metals (5)</h4>
            <p className="text-slate-400 text-xs">Gold (XAUUSD), Silver (XAGUSD), Platinum (XPTUSD), Palladium (XPDUSD), Copper (XCUUSD)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
