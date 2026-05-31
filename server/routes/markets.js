// ================================
// MARKET DATA ROUTES
// ================================

const express = require('express');

const router = express.Router();

// Sample market data for cryptocurrencies and forex
const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'MATIC', 'LINK', 'USDC'];
const FOREX_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD', 'XAU/USD', 'GBP/JPY', 'CHF/USD', 'AUD/USD'];

// Generate sample market data function
const generateSampleData = () => {
  return [
    ...CRYPTO_SYMBOLS.map(symbol => ({
      symbol,
      currentPrice: Math.random() * 50000 + 100,
      previousPrice: Math.random() * 50000 + 100,
      percentChange: (Math.random() - 0.5) * 10,
      marketCap: Math.random() * 1000000000,
      volume24h: Math.random() * 50000000,
      high24h: Math.random() * 60000,
      low24h: Math.random() * 40000,
    })),
    ...FOREX_PAIRS.map(symbol => ({
      symbol,
      currentPrice: Math.random() * 2 + 0.5,
      previousPrice: Math.random() * 2 + 0.5,
      percentChange: (Math.random() - 0.5) * 5,
      volume24h: Math.random() * 100000000,
    })),
  ];
};

// -------- GET ALL MARKET DATA --------
router.get('/', async (req, res) => {
  try {
    // Return sample market data (no database needed)
    const sampleData = generateSampleData();
    res.json({ marketData: sampleData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET SPECIFIC MARKET DATA --------
router.get('/:symbol', async (req, res) => {
  try {
    let marketData = await MarketData.findOne({ symbol: req.params.symbol.toUpperCase() });

    if (!marketData) {
      // Generate sample data if not found
      marketData = new MarketData({
        symbol: req.params.symbol.toUpperCase(),
        currentPrice: Math.random() * 50000 + 100,
        previousPrice: Math.random() * 50000 + 100,
        percentChange: (Math.random() - 0.5) * 10,
        marketCap: Math.random() * 1000000000,
        volume24h: Math.random() * 50000000,
        high24h: Math.random() * 60000,
        low24h: Math.random() * 40000,
        lastUpdated: new Date(),
      });

      await marketData.save();
    }

    res.json({ marketData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET TOP GAINERS --------
router.get('/stats/gainers', async (req, res) => {
  try {
    const gainers = await MarketData.find({ percentChange: { $gt: 0 } })
      .sort({ percentChange: -1 })
      .limit(10);

    res.json({ gainers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET TOP LOSERS --------
router.get('/stats/losers', async (req, res) => {
  try {
    const losers = await MarketData.find({ percentChange: { $lt: 0 } })
      .sort({ percentChange: 1 })
      .limit(10);

    res.json({ losers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
