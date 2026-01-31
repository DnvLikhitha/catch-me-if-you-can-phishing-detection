import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader, Globe } from 'lucide-react';
import { analyzeUrl } from '../config/api';

export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'safe':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'suspicious':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'dangerous':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'safe':
        return <CheckCircle className="w-6 h-6" />;
      case 'suspicious':
        return <AlertTriangle className="w-6 h-6" />;
      case 'dangerous':
      case 'critical':
        return <XCircle className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            URL Analyzer
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check if a website is safe or potentially malicious
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to analyze (e.g., https://example.com)"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                     text-white font-medium rounded-lg transition-colors
                     flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Threat Score Card */}
          <div className={`p-6 rounded-lg border-2 ${getRiskColor(result.risk_level)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getRiskIcon(result.risk_level)}
                <div>
                  <h3 className="text-lg font-bold uppercase">
                    {result.risk_level}
                  </h3>
                  <p className="text-sm opacity-80">
                    Threat Score: {result.threat_score}/100
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{result.threat_score}</div>
                <div className="text-xs opacity-80">
                  {result.confidence * 100}% confidence
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${result.threat_score}%`,
                  backgroundColor: result.threat_score >= 85 ? '#ef4444' :
                                   result.threat_score >= 60 ? '#f97316' :
                                   result.threat_score >= 30 ? '#eab308' : '#22c55e'
                }}
              />
            </div>
          </div>

          {/* Analysis Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">ML Score</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.analysis.ml_contribution.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Heuristic</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.analysis.heuristic_contribution.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Threat Intel</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.analysis.threat_intel_contribution.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Lookalike</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.analysis.lookalike_contribution.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Lookalike Detection */}
          {result.analysis.lookalike_detected && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">Lookalike Domain Detected!</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                This domain appears to impersonate: <strong>{result.analysis.lookalike_brand}</strong>
              </p>
            </div>
          )}

          {/* Reasons */}
          {result.analysis.reasons && result.analysis.reasons.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                Detection Reasons:
              </h4>
              <ul className="space-y-2">
                {result.analysis.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${
                      reason.severity === 'critical' ? 'bg-red-500' :
                      reason.severity === 'high' ? 'bg-orange-500' :
                      reason.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {reason.factor}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          <div className={`p-4 rounded-lg border ${
            result.recommendation === 'block' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
            result.recommendation === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}>
            <div className="font-bold text-gray-900 dark:text-white mb-1">
              Recommendation: {result.recommendation.toUpperCase()}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {result.recommendation === 'block' && 'This URL should be blocked. Do not proceed.'}
              {result.recommendation === 'warn' && 'Exercise caution. Verify before proceeding.'}
              {result.recommendation === 'allow' && 'This URL appears safe to visit.'}
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Links */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick test with:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'http://paypal-secure-verify.tk/account/login',
            'https://g00gle.com/signin',
            'https://github.com/login'
          ].map((testUrl) => (
            <button
              key={testUrl}
              onClick={() => setUrl(testUrl)}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                       dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
            >
              {testUrl.slice(0, 40)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
