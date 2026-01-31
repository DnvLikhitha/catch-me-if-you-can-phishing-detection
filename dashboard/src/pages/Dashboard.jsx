import React, { useState, useEffect } from 'react';
import { supabase, getUserId } from '../config/supabase';
import StatCard from '../components/StatCard';
import { Shield, AlertTriangle, Target, DollarSign, Users, Award } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalThreats: 0,
    threatsLast30Days: 0,
    threatsBlocked: 0,
    credentialTheftPrevented: 0,
    highestThreatScore: 0,
    avgThreatScore: 0
  });
  
  const [timelineData, setTimelineData] = useState([]);
  const [attackVectorData, setAttackVectorData] = useState([]);
  const [riskLevelData, setRiskLevelData] = useState([]);
  const [protectionSavings, setProtectionSavings] = useState(0);
  const [percentile, setPercentile] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userId = getUserId();
      
      // Fetch basic stats from view
      const { data: statsData } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (statsData) {
        setStats({
          totalThreats: statsData.total_threats || 0,
          threatsLast30Days: statsData.threats_last_30_days || 0,
          threatsBlocked: statsData.threats_blocked || 0,
          credentialTheftPrevented: statsData.credential_theft_prevented || 0,
          highestThreatScore: statsData.highest_threat_score || 0,
          avgThreatScore: Math.round(statsData.avg_threat_score || 0)
        });
      }
      
      // Fetch timeline data
      const { data: timeline } = await supabase
        .rpc('get_daily_threat_timeline', { p_user_id: userId, p_days: 30 });
      
      if (timeline) {
        setTimelineData(timeline.map(item => ({
          date: format(new Date(item.date), 'MMM dd'),
          threats: item.threat_count,
          avgScore: parseFloat(item.avg_score)
        })).reverse());
      }
      
      // Fetch attack vector breakdown
      const { data: attackVectors } = await supabase
        .rpc('get_attack_vector_breakdown', { p_user_id: userId });
      
      if (attackVectors) {
        setAttackVectorData(attackVectors.map(item => ({
          name: item.attack_vector === 'web' ? 'Web Phishing' : 'Email Phishing',
          value: parseInt(item.count)
        })));
      }
      
      // Fetch risk level distribution
      const { data: riskLevels } = await supabase
        .rpc('get_risk_level_distribution', { p_user_id: userId });
      
      if (riskLevels) {
        setRiskLevelData(riskLevels.map(item => ({
          name: item.risk_level,
          value: parseInt(item.count)
        })));
      }
      
      // Calculate protection savings
      const { data: savings } = await supabase
        .rpc('calculate_protection_savings', { p_user_id: userId });
      
      if (savings !== null) {
        setProtectionSavings(savings);
      }
      
      // Get user percentile
      const { data: userPercentile } = await supabase
        .rpc('get_user_percentile', { p_user_id: userId });
      
      if (userPercentile !== null) {
        setPercentile(userPercentile);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    Safe: '#10b981',
    Suspicious: '#f59e0b',
    Dangerous: '#f97316',
    Critical: '#ef4444'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Threats Blocked"
          value={stats.threatsBlocked}
          subtitle="All-time protection"
          icon={Shield}
          trend="up"
          trendValue={`${stats.threatsLast30Days} in last 30 days`}
        />
        
        <StatCard
          title="Credential Theft Prevented"
          value={stats.credentialTheftPrevented}
          subtitle="Login forms blocked"
          icon={AlertTriangle}
        />
        
        <StatCard
          title="Highest Threat Score"
          value={stats.highestThreatScore}
          subtitle="Most dangerous encounter"
          icon={Target}
        />
        
        <StatCard
          title="Protection Savings"
          value={`$${(protectionSavings / 1000).toFixed(1)}K`}
          subtitle="Estimated value protected"
          icon={DollarSign}
        />
      </div>

      {/* User Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Community Ranking</h3>
          </div>
          <div className="text-center py-6">
            <p className="text-5xl font-bold text-blue-600">{percentile}%</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You're safer than <span className="font-semibold">{percentile}%</span> of users
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Based on threat exposure and blocking rate
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold">Key Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Average Threat Score: {stats.avgThreatScore}/100
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Most threats are medium severity
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats.threatsLast30Days} threats blocked this month
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your browsing is well protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Threat Timeline (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="threats" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Threats Detected"
              />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Avg Threat Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attack Vector Breakdown */}
      {attackVectorData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Attack Vector Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {attackVectorData.map((vector, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium">{vector.name}</span>
                <span className="text-2xl font-bold text-blue-600">{vector.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
