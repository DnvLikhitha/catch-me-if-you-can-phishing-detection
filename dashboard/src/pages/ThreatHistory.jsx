import React, { useState, useEffect } from 'react';
import { supabase, getUserId } from '../config/supabase';
import { Search, Filter, Download, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ThreatHistory() {
  const [threats, setThreats] = useState([]);
  const [filteredThreats, setFilteredThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRiskLevel, setFilterRiskLevel] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [currentPage, setCurrentPage] = useState(1);
  const threatsPerPage = 20;

  useEffect(() => {
    fetchThreats();
  }, []);

  useEffect(() => {
    filterAndSortThreats();
  }, [threats, searchQuery, filterRiskLevel, sortBy]);

  const fetchThreats = async () => {
    try {
      const userId = getUserId();
      
      const { data, error } = await supabase
        .from('threat_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(500);

      if (error) throw error;
      setThreats(data || []);
    } catch (error) {
      console.error('Error fetching threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortThreats = () => {
    let filtered = [...threats];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(threat =>
        threat.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Risk level filter
    if (filterRiskLevel !== 'all') {
      filtered = filtered.filter(threat => threat.risk_level === filterRiskLevel);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'threat_score') {
        return b.threat_score - a.threat_score;
      }
      return 0;
    });

    setFilteredThreats(filtered);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'URL', 'Domain', 'Threat Score', 'Risk Level', 'Action', 'Reasons'];
    const csvData = filteredThreats.map(threat => [
      format(new Date(threat.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      threat.url,
      threat.domain,
      threat.threat_score,
      threat.risk_level,
      threat.user_action,
      (threat.threat_reasons || []).map(r => r.factor).join('; ')
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard-threats-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      Safe: 'badge-safe',
      Suspicious: 'badge-suspicious',
      Dangerous: 'badge-dangerous',
      Critical: 'badge-critical'
    };
    return colors[level] || 'badge-safe';
  };

  // Pagination
  const indexOfLastThreat = currentPage * threatsPerPage;
  const indexOfFirstThreat = indexOfLastThreat - threatsPerPage;
  const currentThreats = filteredThreats.slice(indexOfFirstThreat, indexOfLastThreat);
  const totalPages = Math.ceil(filteredThreats.length / threatsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading threat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Threat History</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredThreats.length} threats detected
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by URL or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="Safe">Safe</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Dangerous">Dangerous</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="timestamp">Sort by Date</option>
            <option value="threat_score">Sort by Threat Score</option>
          </select>
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-4">
        {currentThreats.length === 0 ? (
          <div className="card text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No threats found</p>
          </div>
        ) : (
          currentThreats.map((threat) => (
            <div key={threat.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`badge ${getRiskLevelColor(threat.risk_level)}`}>
                      {threat.risk_level}
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {threat.threat_score}/100
                    </span>
                    {threat.credential_detected && (
                      <span className="badge bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        🔐 Credentials Detected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(threat.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Domain:</span>
                      <span className="font-mono">{threat.domain}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">URL:</span>
                      <a 
                        href={threat.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-2xl"
                      >
                        <span className="truncate">{threat.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {threat.threat_reasons && threat.threat_reasons.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="font-medium text-sm text-red-900 dark:text-red-200 mb-2">
                        ⚠️ Threat Indicators:
                      </p>
                      <ul className="space-y-1">
                        {threat.threat_reasons.slice(0, 3).map((reason, idx) => (
                          <li key={idx} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                            <span className="text-red-600 dark:text-red-400">•</span>
                            <span>{reason.factor} (weight: {reason.weight})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    threat.user_action === 'blocked' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : threat.user_action === 'proceeded'
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {threat.user_action}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
