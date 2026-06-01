// ================================
// TRADEX - Login Page
// ================================

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../App';
import API_URL from '../api';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2d1b4e] flex items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#00ff84] to-[#00d4ff] bg-clip-text text-transparent">
              TRADEX
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[#a8adc6]">Sign in to your trading account</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[rgba(26,31,58,0.4)] to-[rgba(41,72,255,0.05)] backdrop-blur-xl border border-[rgba(73,72,255,0.2)] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#a8adc6]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-[rgba(10,14,39,0.5)] border border-[rgba(73,72,255,0.3)] rounded-lg text-white placeholder-[#a8adc6] focus:outline-none focus:border-[#2948ff] focus:ring-2 focus:ring-[rgba(41,72,255,0.2)] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#a8adc6]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-[rgba(10,14,39,0.5)] border border-[rgba(73,72,255,0.3)] rounded-lg text-white placeholder-[#a8adc6] focus:outline-none focus:border-[#2948ff] focus:ring-2 focus:ring-[rgba(41,72,255,0.2)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a8adc6] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[rgba(255,107,107,0.1)] border border-[#ff6b6b] rounded-lg text-[#ff6b6b] text-sm">
                {error}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-[rgba(41,72,255,0.2)] border-[#2948ff]" />
                <span className="text-sm text-[#a8adc6]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#2948ff] hover:text-[#4f46e5]">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2948ff] to-[#4f46e5] text-white font-bold py-3 rounded-lg hover:from-[#2940e8] hover:to-[#463dd4] transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(73,72,255,0.2)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-[rgba(26,31,58,0.4)] to-[rgba(41,72,255,0.05)] text-[#a8adc6]">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full block text-center py-3 rounded-lg border border-[#2948ff] text-[#2948ff] font-bold hover:bg-[rgba(41,72,255,0.1)] transition-all"
            >
              Create Account
            </Link>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-[rgba(0,255,132,0.1)] border border-[#00ff84] rounded-lg">
          <p className="text-xs text-[#a8adc6] mb-2">Demo Credentials:</p>
          <p className="text-sm text-white font-mono">Email: demo@tradex.com</p>
          <p className="text-sm text-white font-mono">Pass: Demo@123</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
