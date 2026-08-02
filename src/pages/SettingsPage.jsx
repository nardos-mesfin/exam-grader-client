// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

const SettingsPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasCustomApiKey, setHasCustomApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/settings');
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setHasCustomApiKey(res.data.has_custom_api_key);
        setApiKey(res.data.gemini_api_key || '');
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = { name };
      // Only include gemini_api_key if user typed something new
      if (apiKey && !apiKey.endsWith('...')) {
        payload.gemini_api_key = apiKey;
      }

      const res = await api.put('/api/settings', payload);
      alert('Settings updated successfully!');
      setHasCustomApiKey(res.data.has_custom_api_key);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Could not update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-white">Loading settings...</div>;
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="mt-1 text-subtle-text text-sm">
            Manage your account settings and Gemini AI configuration.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-surface bg-surface p-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Teacher Profile</h2>

            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-white mb-1">
                Name
              </label>
              <input
                id="user-name"
                type="text"
                className="form-input block w-full rounded-xl border border-background bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="user-email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input
                id="user-email"
                type="email"
                disabled
                className="form-input block w-full rounded-xl border border-background bg-background/50 px-4 py-3 text-subtle-text cursor-not-allowed"
                value={email}
              />
            </div>
          </div>

          {/* Gemini API Key Card */}
          <div className="rounded-2xl border border-surface bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Google Gemini API Key</h2>
                <p className="text-xs text-subtle-text mt-1">
                  Provide your custom API key or use the default system key.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                hasCustomApiKey ? 'bg-green-500/10 text-green-400' : 'bg-subtle-text/10 text-subtle-text'
              }`}>
                {hasCustomApiKey ? 'Custom Key Active' : 'Using Default System Key'}
              </span>
            </div>

            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-white mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  className="form-input block w-full rounded-xl border border-background bg-background px-4 py-3 pr-12 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0 font-mono text-sm"
                  placeholder="Paste your Gemini API key (e.g. AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-text hover:text-white"
                  title="Toggle Visibility"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showApiKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-background/50 p-4 border border-background flex items-center justify-between gap-4">
              <div className="text-xs text-subtle-text">
                Need a free Gemini API key? Get one in 30 seconds from Google AI Studio.
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Get API Key</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-background transition-transform hover:scale-105 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SettingsPage;