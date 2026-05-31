// ================================
// TRADING CONTEXT
// ================================

import React, { createContext, useState } from 'react';
import api from '../services/api';

export const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrades = async (status = null) => {
    try {
      setLoading(true);
      const response = await api.getTrades(status);
      setTrades(response.trades);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const response = await api.getWallets();
      setWallets(response.wallets);
      return response;
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMarkets = async () => {
    try {
      const response = await api.getMarkets();
      setMarkets(response.marketData);
      return response;
    } catch (err) {
      setError(err.message);
    }
  };

  const placeTrade = async (data) => {
    try {
      setLoading(true);
      const response = await api.placeTrade(data);
      await fetchTrades();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeTrade = async (tradeId, exitPrice) => {
    try {
      setLoading(true);
      const response = await api.closeTrade(tradeId, exitPrice);
      await fetchTrades();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TradingContext.Provider
      value={{
        trades,
        wallets,
        markets,
        loading,
        error,
        fetchTrades,
        fetchWallets,
        fetchMarkets,
        placeTrade,
        closeTrade,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = React.useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within TradingProvider');
  }
  return context;
};
