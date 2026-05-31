// ================================
// MAILBOX PAGE - VIEW SUBMITTED REPORTS
// ================================

import React, { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, AlertCircle, User, MessageSquare, Calendar } from 'lucide-react';
import api from '../services/api';

export default function MailboxPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/my-reports');
      setReports(res.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="text-yellow-400" size={18} />;
      case 'in-progress':
        return <Clock className="text-blue-400" size={18} />;
      case 'resolved':
        return <CheckCircle className="text-green-400" size={18} />;
      case 'closed':
        return <Mail className="text-slate-400" size={18} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return '';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical':
        return '🔧';
      case 'account':
        return '👤';
      case 'payment':
        return '💳';
      case 'trading':
        return '📈';
      case 'security':
        return '🔐';
      default:
        return '❓';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
          📬 My Reports
        </h1>
        <p className="text-slate-300">Track all your support requests and issues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total Reports</p>
          <p className="text-2xl font-bold text-white">{reports.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Open</p>
          <p className="text-2xl font-bold text-yellow-400">{reports.filter(r => r.status === 'open').length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{reports.filter(r => r.status === 'in-progress').length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-400">{reports.filter(r => r.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {reports.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <Mail className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 mb-4">No reports yet</p>
              <p className="text-slate-500 text-sm">Submit a report to get help with any issues</p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                onClick={() => setSelectedReport(report)}
                className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer transition hover:border-cyan-500/50 ${
                  selectedReport?._id === report._id ? 'border-cyan-500/50' : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-white">{report.subject}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">{report.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className={`px-2 py-1 rounded ${getPriorityColor(report.priority)}`}>
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  {report.adminResponse && (
                    <span className="text-green-400 text-xs font-semibold">✓ Replied</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Report Details */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <div className="mb-4 pb-4 border-b border-slate-700/30">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-3xl">{getCategoryIcon(selectedReport.category)}</span>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedReport.subject}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(selectedReport.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Category</p>
                  <p className="text-sm text-white capitalize">{selectedReport.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Priority</p>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedReport.status)}
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/30">
                <p className="text-xs text-slate-400 mb-2">Message</p>
                <p className="text-sm text-slate-300">{selectedReport.message}</p>
              </div>

              {selectedReport.adminResponse && (
                <div className="mt-4 pt-4 border-t border-slate-700/30">
                  <p className="text-xs text-green-400 font-semibold mb-2 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Admin Response
                  </p>
                  <p className="text-sm text-slate-300">{selectedReport.adminResponse.response}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {formatDate(selectedReport.adminResponse.respondedAt)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
