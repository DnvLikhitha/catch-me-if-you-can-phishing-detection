import React, { useState, useEffect } from 'react';
import { supabase, getUserId } from '../config/supabase';
import { Trophy, Target, TrendingUp, Award, Play } from 'lucide-react';

export default function TrainingMode() {
  const [progress, setProgress] = useState({
    totalSimulations: 0,
    passedSimulations: 0,
    successRate: 0,
    avgDecisionTime: 0,
    streak: 0
  });
  const [badges, setBadges] = useState([]);
  const [recentSimulations, setRecentSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const userId = getUserId();

      // Fetch training progress
      const { data: progressData } = await supabase
        .rpc('get_training_progress', { p_user_id: userId });

      if (progressData && progressData.length > 0) {
        const prog = progressData[0];
        setProgress({
          totalSimulations: parseInt(prog.total_simulations) || 0,
          passedSimulations: parseInt(prog.passed_simulations) || 0,
          successRate: parseFloat(prog.success_rate) || 0,
          avgDecisionTime: parseFloat(prog.avg_decision_time) || 0,
          streak: parseInt(prog.streak) || 0
        });
      }

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('achievement_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      setBadges(badgesData || []);

      // Fetch recent simulations
      const { data: simulationsData } = await supabase
        .from('simulation_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);

      setRecentSimulations(simulationsData || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = () => {
    alert('Simulation mode will be available in the browser extension. Enable it in Settings!');
  };

  const badgeInfo = {
    first_threat_blocked: { emoji: '🛡️', name: 'First Defense', description: 'Blocked your first threat' },
    first_simulation_passed: { emoji: '🎯', name: 'Quick Learner', description: 'Passed your first simulation' },
    phishing_expert: { emoji: '🏆', name: 'Phishing Expert', description: '10 simulations passed in a row' },
    week_streak: { emoji: '🔥', name: 'Week Warrior', description: '7-day active streak' },
    guardian_angel: { emoji: '👼', name: 'Guardian Angel', description: '100+ threats blocked' },
    community_contributor: { emoji: '🤝', name: 'Community Hero', description: 'Contributed to community intelligence' },
    early_adopter: { emoji: '🚀', name: 'Early Adopter', description: 'Joined PhishGuard AI early' },
    threat_hunter: { emoji: '🔍', name: 'Threat Hunter', description: 'Reported 10+ false positives' }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading training data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Training Mode</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Practice identifying phishing threats in a safe environment
          </p>
        </div>
        <button
          onClick={startSimulation}
          className="btn-primary flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Simulation
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {progress.totalSimulations}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Simulations</p>
        </div>

        <div className="card text-center">
          <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-600">
            {progress.successRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
        </div>

        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-yellow-600">
            {progress.streak}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
        </div>

        <div className="card text-center">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-purple-600">
            {badges.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">🏆 Achievement Badges</h3>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No badges earned yet. Start training to unlock achievements!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const info = badgeInfo[badge.badge_name] || { emoji: '🎖️', name: badge.badge_name, description: 'Achievement unlocked' };
              return (
                <div
                  key={badge.id}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-700"
                >
                  <div className="text-4xl text-center mb-2">{info.emoji}</div>
                  <p className="font-bold text-center text-gray-900 dark:text-white">{info.name}</p>
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Simulations */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">📊 Recent Simulations</h3>
        {recentSimulations.length === 0 ? (
          <div className="text-center py-8">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No simulations completed yet. Enable training mode in the extension!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSimulations.map((sim, idx) => (
              <div
                key={sim.id}
                className={`p-4 rounded-lg border-2 ${
                  sim.correct_identification
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {sim.correct_identification ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {sim.simulation_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sim.clicked ? 'Clicked' : 'Avoided'} • {sim.time_to_decision}s decision time
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Threat Score: {sim.threat_score_shown}/100
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Training Tips */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700">
        <h3 className="text-lg font-semibold mb-3">💡 Training Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Enable training mode in extension settings to receive weekly simulations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Look for suspicious URLs, urgency keywords, and domain mismatches</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Build a 10-simulation streak to earn the "Phishing Expert" badge</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Your training performance helps improve the AI model for everyone</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
