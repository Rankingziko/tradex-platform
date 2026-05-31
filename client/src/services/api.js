// ================================
// API CONFIGURATION
// ================================

// API_URL is set dynamically in the constructor based on environment

class APIClient {
  constructor() {
    // Detect if we're on ngrok and use appropriate API URL
    const hostname = window.location.hostname;
    let apiUrl;
    
    if (hostname.includes('ngrok')) {
      // If on ngrok domain, use localhost API (assumes same machine testing)
      apiUrl = 'http://localhost:5000/api';
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Local development
      apiUrl = 'http://localhost:5000/api';
    } else {
      // Use environment variable or fallback
      apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    }
    
    this.baseURL = apiUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
    };
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Request failed';
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  login(data) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getCurrentUser() {
    return this.request('/auth/me');
  }

  updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  changePassword(data) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Wallet endpoints
  getWallets() {
    return this.request('/wallets');
  }

  getWallet(currency) {
    return this.request(`/wallets/${currency}`);
  }

  // Trade endpoints
  placeTrade(data) {
    return this.request('/trades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getTrades(status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/trades${query}`);
  }

  closeTrade(tradeId, exitPrice) {
    return this.request(`/trades/${tradeId}/close`, {
      method: 'PUT',
      body: JSON.stringify({ exitPrice }),
    });
  }

  // Deposit endpoints
  createDeposit(data) {
    return this.request('/deposits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getDeposits() {
    return this.request('/deposits');
  }

  getPaymentMethods() {
    return this.request('/deposits/methods');
  }

  // Withdrawal endpoints
  createWithdrawal(data) {
    return this.request('/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getWithdrawals() {
    return this.request('/withdrawals');
  }

  // Transfer endpoints
  sendTransfer(data) {
    return this.request('/transfers/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getTransfers() {
    return this.request('/transfers');
  }

  // Market endpoints
  getMarkets() {
    return this.request('/markets');
  }

  getMarket(symbol) {
    return this.request(`/markets/${symbol}`);
  }

  // Notification endpoints
  getNotifications() {
    return this.request('/notifications');
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Admin endpoints
  getAdminStats() {
    return this.request('/admin/stats/dashboard');
  }

  getPendingDeposits() {
    return this.request('/admin/deposits/pending');
  }

  getPendingWithdrawals() {
    return this.request('/admin/withdrawals/pending');
  }

  approveDeposit(depositId) {
    return this.request(`/deposits/${depositId}/approve`, {
      method: 'PUT',
    });
  }

  rejectDeposit(depositId, reason) {
    return this.request(`/deposits/${depositId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  approveWithdrawal(withdrawalId) {
    return this.request(`/withdrawals/${withdrawalId}/approve`, {
      method: 'PUT',
    });
  }

  rejectWithdrawal(withdrawalId, reason) {
    return this.request(`/withdrawals/${withdrawalId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  broadcastNotification(data) {
    return this.request('/admin/broadcast-notification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic methods for flexible API calls
  get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new APIClient();
