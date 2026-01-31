import React, { useState } from 'react';
import { Save, Database, Bell, Shield, Users } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('phishguard_settings');
    return saved ? JSON.parse(saved) : {
      notifications_enabled: true,
      dark_mode: false,
      auto_sync: true,
      training_mode: false,
      community_sharing: false
    };
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('phishguard_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Send message to extension if available
    if (window.chrome && window.chrome.runtime) {
      window.chrome.runtime.sendMessage({
        type: 'SETTINGS_UPDATED',
        settings
      });
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your PhishGuard AI preferences
        </p>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get alerts when threats are detected
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) => handleChange('notifications_enabled', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Data & Sync */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Data & Sync</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Auto-Sync to Cloud</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically backup threat data to Supabase
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.auto_sync}
              onChange={(e) => handleChange('auto_sync', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </label>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Privacy Note:</strong> Only threat metadata is synced (URLs, threat scores, actions).
              No personal data or credentials are ever transmitted.
            </p>
          </div>
        </div>
      </div>

      {/* Training Mode */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Training & Education</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Training Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive weekly phishing simulations to improve your detection skills
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.training_mode}
              onChange={(e) => handleChange('training_mode', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Community */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Community Intelligence</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Share Threat Data</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contribute anonymized threat data to help protect the community
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.community_sharing}
              onChange={(e) => handleChange('community_sharing', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </label>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Community Benefits:</strong> When enabled, your blocked threats help identify
              new phishing campaigns faster, protecting all PhishGuard users worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary text-left">
            View Whitelist ({0} domains)
          </button>
          <button className="w-full btn-secondary text-left text-red-600 dark:text-red-400">
            Clear Local Data
          </button>
          <button className="w-full btn-secondary text-left text-red-600 dark:text-red-400">
            Delete Account & All Data
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={saveSettings}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        {saved && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✓ Settings saved successfully!
          </span>
        )}
      </div>

      {/* Version Info */}
      <div className="card bg-gray-50 dark:bg-gray-800/50 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          PhishGuard AI Dashboard v1.0.0
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Built with ❤️ for Catch Me If You Can Hackathon
        </p>
      </div>
    </div>
  );
}
