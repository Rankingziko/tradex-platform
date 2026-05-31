// ================================
// WALLET PAGE
// ================================

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Send, Download, ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import api from '../services/api';

export default function WalletPage() {
  const { wallets, fetchWallets } = useTrading();
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [paymentMethods, setPaymentMethods] = useState({});
  const [selectedMethod, setSelectedMethod] = useState('opay');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState('');

  useEffect(() => {
    fetchWallets();
    loadTransactions();
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    const defaultMethods = {
      opay: {
        name: 'OPay',
        icon: 'wallet',
        description: 'Send money via OPay',
        accountName: 'EBIYOR ZIKOREBAI',
        accountNumber: '8066824832',
        provider: 'OPay',
        minAmount: 100,
        maxAmount: 100000,
      },
      naira: {
        name: 'Naira (NGN)',
        icon: 'coins',
        description: 'Nigerian Naira via OPay',
        currency: 'NGN',
        accountName: 'EBIYOR ZIKOROBI',
        paymentMethod: 'OPay',
        accountNumber: '8066824832',
        minAmount: 5000,
        maxAmount: 10000000,
      },
      bank_transfer: {
        name: 'Bank Transfer',
        icon: 'building',
        description: 'Direct bank transfer',
        accountName: 'EBIYOR ZIKOROBAI',
        accountNumber: '8066824832',
        minAmount: 100,
        maxAmount: 500000,
      },
      bitcoin: {
        name: 'Bitcoin (BTC)',
        icon: 'bitcoin',
        description: 'Send Bitcoin directly',
        currency: 'BTC',
        minAmount: 0.001,
        maxAmount: 10,
        walletAddress: '1A1z7agoat3Z5QqRrXhKfvDkgvgPDk3bAV',
        networkFee: 'Variable',
      },
      ethereum: {
        name: 'Ethereum (ETH)',
        icon: 'ethereum',
        description: 'Send Ethereum directly',
        currency: 'ETH',
        minAmount: 0.01,
        maxAmount: 100,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc42e4b29234Be',
        networkFee: 'Variable',
      },
      usdt_trc20: {
        name: 'USDT (TRC20)',
        icon: 'coins',
        description: 'USDT on TRON network (cheaper fees)',
        currency: 'USDT',
        network: 'TRON',
        minAmount: 10,
        maxAmount: 100000,
        walletAddress: 'TKJHqVDTKBqNczBj7crZxPvVHXfZE8d8mY',
        networkFee: 'Minimal (~$1)',
      },
      usdt_bep20: {
        name: 'USDT (BEP20)',
        icon: 'coins',
        description: 'USDT on Binance Smart Chain',
        currency: 'USDT',
        network: 'BSC',
        minAmount: 10,
        maxAmount: 100000,
        walletAddress: '0x9F5B9Af3Bc9f0BedFf0Ee5dB5E4E5E4E5E4E5E4',
        networkFee: 'Low (~$1)',
      },
      bnb: {
        name: 'Binance Coin (BNB)',
        icon: 'coins',
        description: 'Send Binance Coin',
        currency: 'BNB',
        network: 'BSC',
        minAmount: 0.01,
        maxAmount: 500,
        walletAddress: '0xAb8483f64d9C6d1EcF9b849Ae677dD3315835cb2',
        networkFee: 'Low',
      },
      card: {
        name: 'Credit/Debit Card',
        icon: 'creditcard',
        description: 'Visa, Mastercard',
        minAmount: 50,
        maxAmount: 50000,
        processingTime: '1-3 minutes',
      },
    };

    try {
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.methods || defaultMethods);
    } catch (error) {
      console.error('Error loading payment methods from API:', error);
      // Use default methods as fallback
      setPaymentMethods(defaultMethods);
    }
  };

  const loadTransactions = async () => {
    try {
      const deps = await api.getDeposits();
      const withs = await api.getWithdrawals();
      setDeposits(deps.deposits);
      setWithdrawals(withs.withdrawals);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      setDepositMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setDepositLoading(true);
    setDepositMessage('');

    try {
      const depositData = {
        currency: selectedCurrency,
        amount: parseFloat(amount),
        method: selectedMethod,
        transactionHash: transactionHash || undefined,
      };

      const response = await api.post('/deposits', depositData);
      
      setDepositMessage({ type: 'success', text: 'Deposit created successfully! Please wait for confirmation.' });
      setAmount('');
      setTransactionHash('');
      
      // Reload deposits after a short delay
      setTimeout(() => {
        loadTransactions();
        setShowDepositForm(false);
      }, 2000);
    } catch (error) {
      setDepositMessage({ type: 'error', text: error.response?.data?.error || 'Error creating deposit' });
    } finally {
      setDepositLoading(false);
    }
  };

  const currentMethod = paymentMethods[selectedMethod] || {};
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Wallet</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDepositForm(!showDepositForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            <Plus size={20} />
            Deposit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition">
            <Download size={20} />
            Withdraw
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8">
        <p className="text-slate-300 mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold text-white">${totalBalance.toFixed(2)}</h2>
        <p className="text-sm text-slate-400 mt-2">Across all wallets</p>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map(wallet => (
          <div key={wallet._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">{wallet.currency}</span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Balance</p>
            <p className="text-2xl font-bold text-white mb-4">${wallet.balance.toFixed(2)}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedCurrency(wallet.currency);
                  setShowDepositForm(true);
                }}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-cyan-400 rounded-lg transition text-sm font-semibold">
                Deposit
              </button>
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-cyan-400 rounded-lg transition text-sm font-semibold">
                Send
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deposit Form */}
      {showDepositForm && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
            <button
              onClick={() => setShowDepositForm(false)}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-3">
                <span className="text-cyan-400 font-semibold">📍 Select Currency to Deposit</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {['USDT', 'BTC', 'ETH', 'BNB', 'USD'].map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setSelectedCurrency(curr)}
                    className={`py-3 px-4 rounded-lg font-semibold transition border-2 ${
                      selectedCurrency === curr
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-white/5 border-white/10 text-white hover:border-cyan-500/50'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-3">
                <span className="text-cyan-400 font-semibold">💳 Select Payment Method</span>
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white font-medium hover:border-cyan-500/50 transition"
              >
                <option value="">-- Choose a payment method --</option>
                {Object.entries(paymentMethods).map(([key, method]) => (
                  <option key={key} value={key}>
                    {method.name} - {method.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Method Details */}
            {currentMethod && selectedMethod && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-cyan-400 text-lg">💰 {currentMethod.name} - Payment Details</h3>
                
                {selectedMethod === 'opay' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Account Name</p>
                      <p className="text-white font-mono text-lg font-bold mt-1">{currentMethod.accountName}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Phone/Account Number</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white font-mono text-lg font-bold">{currentMethod.accountNumber}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(currentMethod.accountNumber)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          {copiedAddress === currentMethod.accountNumber ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Min - Max Amount</p>
                      <p className="text-white font-semibold mt-1">${currentMethod.minAmount} - ${currentMethod.maxAmount}</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Account Holder Name</p>
                      <p className="text-white font-mono text-lg font-bold mt-1">{currentMethod.accountName}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Account Number</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white font-mono text-lg font-bold">{currentMethod.accountNumber}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(currentMethod.accountNumber)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          {copiedAddress === currentMethod.accountNumber ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Amount Range</p>
                      <p className="text-white font-semibold mt-1">${currentMethod.minAmount} - ${currentMethod.maxAmount}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-4">
                      <p className="text-blue-300 text-sm">💡 After confirming the amount, you'll receive detailed bank transfer instructions.</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'naira' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Account Holder Name</p>
                      <p className="text-white font-mono text-lg font-bold mt-1">{currentMethod.accountName}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Payment Method</p>
                      <p className="text-white font-semibold mt-1">{currentMethod.paymentMethod}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Account Number / Phone</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white font-mono text-lg font-bold">{currentMethod.accountNumber}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(currentMethod.accountNumber)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          {copiedAddress === currentMethod.accountNumber ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Amount Range (NGN)</p>
                      <p className="text-white font-semibold mt-1">₦{currentMethod.minAmount.toLocaleString()} - ₦{currentMethod.maxAmount.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {['bitcoin', 'ethereum', 'bnb'].includes(selectedMethod) && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Send To Address</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white font-mono text-xs break-all">{currentMethod.walletAddress}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(currentMethod.walletAddress)}
                          className="text-cyan-400 hover:text-cyan-300 flex-shrink-0"
                        >
                          {copiedAddress === currentMethod.walletAddress ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    {currentMethod.network && (
                      <div className="bg-white/5 rounded p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Network</p>
                        <p className="text-white font-semibold mt-1">{currentMethod.network}</p>
                      </div>
                    )}
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Network Fee</p>
                      <p className="text-white font-semibold mt-1">{currentMethod.networkFee}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Amount Range</p>
                      <p className="text-white font-semibold mt-1">{currentMethod.minAmount} - {currentMethod.maxAmount} {currentMethod.currency}</p>
                    </div>
                  </div>
                )}

                {['usdt_trc20', 'usdt_bep20'].includes(selectedMethod) && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Send USDT To Address</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white font-mono text-xs break-all">{currentMethod.walletAddress}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(currentMethod.walletAddress)}
                          className="text-cyan-400 hover:text-cyan-300 flex-shrink-0"
                        >
                          {copiedAddress === currentMethod.walletAddress ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Network</p>
                      <p className="text-white font-semibold mt-1">{currentMethod.network}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Network Fee</p>
                      <p className="text-white font-semibold mt-1">{currentMethod.networkFee}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Amount Range</p>
                      <p className="text-white font-semibold mt-1">${currentMethod.minAmount} - ${currentMethod.maxAmount}</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Accepted Cards</p>
                      <p className="text-white font-semibold mt-1">Visa, Mastercard, American Express</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Processing Time</p>
                      <p className="text-white font-semibold mt-1">{currentMethod.processingTime}</p>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Amount Range</p>
                      <p className="text-white font-semibold mt-1">${currentMethod.minAmount} - ${currentMethod.maxAmount}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
              <input
                type="number"
                placeholder={`Min: ${currentMethod.minAmount || 0}`}
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
              />
              {currentMethod.minAmount && (
                <p className="text-xs text-slate-400 mt-1">
                  Min: {currentMethod.minAmount} | Max: {currentMethod.maxAmount}
                </p>
              )}
            </div>

            {/* Transaction Hash for Crypto */}
            {['bitcoin', 'ethereum', 'bnb', 'usdt_trc20', 'usdt_bep20'].includes(selectedMethod) && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Transaction Hash (Optional)</label>
                <input
                  type="text"
                  placeholder="Paste your transaction hash here for faster confirmation"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-white text-sm"
                />
              </div>
            )}

            {/* Message */}
            {depositMessage && (
              <div className={`p-4 rounded-lg ${
                depositMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {depositMessage.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={depositLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {depositLoading ? 'Processing...' : 'Complete Deposit'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              After completing the transaction, your deposit will be confirmed within 24 hours
            </p>
          </form>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposits */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-green-400" />
            Recent Deposits
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {deposits.slice(0, 5).map(dep => (
              <div key={dep._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div>
                  <p className="font-semibold text-white">{dep.amount} {dep.currency}</p>
                  <p className="text-xs text-slate-400">{new Date(dep.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">{dep.method}</p>
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  dep.status === 'confirmed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : dep.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {dep.status}
                </span>
              </div>
            ))}
            {deposits.length === 0 && <p className="text-slate-400 text-center py-4">No deposits yet</p>}
          </div>
        </div>

        {/* Withdrawals */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-red-400" />
            Recent Withdrawals
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {withdrawals.slice(0, 5).map(with_ => (
              <div key={with_._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div>
                  <p className="font-semibold text-white">{with_.amount} {with_.currency}</p>
                  <p className="text-xs text-slate-400">{new Date(with_.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">{with_.method}</p>
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  with_.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : with_.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {with_.status}
                </span>
              </div>
            ))}
            {withdrawals.length === 0 && <p className="text-slate-400 text-center py-4">No withdrawals yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
