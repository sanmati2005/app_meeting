import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login } = useAuth();
  const [settings, setSettings] = useState({
    mic: true,
    camera: true,
    notifications: true,
    backgroundBlur: false,
    noiseSuppression: true,
    virtualBackground: '',
    language: 'en',
    translation: false
  });
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user preferences on component mount
  useEffect(() => {
    if (user && user.preferences) {
      const loadedSettings = {
        mic: user.preferences.audio?.noiseSuppression ?? true,
        camera: user.preferences.video?.backgroundBlur ?? false,
        notifications: user.preferences.notifications?.email ?? true,
        backgroundBlur: user.preferences.video?.backgroundBlur ?? false,
        noiseSuppression: user.preferences.audio?.noiseSuppression ?? true,
        virtualBackground: user.preferences.video?.virtualBackground ?? '',
        language: 'en', // Default language
        translation: false // Default translation setting
      };
      
      setSettings(loadedSettings);
      setOriginalSettings(loadedSettings);
    }
  }, [user]);

  const handleSettingChange = (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    
    setSettings(newSettings);
  };

  const handleSelectChange = (setting, value) => {
    const newSettings = {
      ...settings,
      [setting]: value
    };
    
    setSettings(newSettings);
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Map flat settings to nested preferences structure
      const preferences = {
        theme: theme,
        notifications: {
          email: settings.notifications,
          push: user?.preferences?.notifications?.push ?? true
        },
        audio: {
          noiseSuppression: settings.noiseSuppression,
          echoCancellation: user?.preferences?.audio?.echoCancellation ?? true
        },
        video: {
          backgroundBlur: settings.backgroundBlur,
          virtualBackground: settings.virtualBackground
        }
      };
      
      // Update profile with new preferences
      const response = await api.updateProfile({
        preferences
      });
      
      if (response.success) {
        // Update auth context with new user data
        const updatedUser = {
          ...user,
          preferences
        };
        
        login(localStorage.getItem('token'), updatedUser);
        setSuccess('Settings saved successfully!');
        setOriginalSettings(settings); // Update original settings to match saved
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Settings save error:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const aiBackgrounds = [
    { id: 'blur', name: 'Blur Background', preview: 'blur' },
    { id: 'office', name: 'Modern Office', preview: 'office' },
    { id: 'beach', name: 'Tropical Beach', preview: 'beach' },
    { id: 'mountain', name: 'Mountain View', preview: 'mountain' },
    { id: 'custom', name: 'Upload Custom', preview: 'custom' }
  ];

  // Check if settings have been modified
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Customize your meeting experience</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="settings-content">
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Theme</span>
              <span className="setting-description">Switch between light and dark mode</span>
            </div>
            <button 
              className={`toggle-button ${theme === 'dark' ? 'on' : 'off'}`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Audio & Video</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Microphone</span>
              <span className="setting-description">Enable/disable your microphone</span>
            </div>
            <button 
              className={`toggle-button ${settings.mic ? 'on' : 'off'}`}
              onClick={() => handleSettingChange('mic')}
              disabled={loading}
            >
              {settings.mic ? 'On' : 'Off'}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Camera</span>
              <span className="setting-description">Enable/disable your camera</span>
            </div>
            <button 
              className={`toggle-button ${settings.camera ? 'on' : 'off'}`}
              onClick={() => handleSettingChange('camera')}
              disabled={loading}
            >
              {settings.camera ? 'On' : 'Off'}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Noise Suppression</span>
              <span className="setting-description">Reduce background noise during meetings</span>
            </div>
            <button 
              className={`toggle-button ${settings.noiseSuppression ? 'on' : 'off'}`}
              onClick={() => handleSettingChange('noiseSuppression')}
              disabled={loading}
            >
              {settings.noiseSuppression ? 'On' : 'Off'}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Background Blur</span>
              <span className="setting-description">Blur your background for privacy</span>
            </div>
            <button 
              className={`toggle-button ${settings.backgroundBlur ? 'on' : 'off'}`}
              onClick={() => handleSettingChange('backgroundBlur')}
              disabled={loading}
            >
              {settings.backgroundBlur ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>AI Virtual Backgrounds</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Virtual Background</span>
              <span className="setting-description">Choose an AI-generated background</span>
            </div>
            <select 
              value={settings.virtualBackground}
              onChange={(e) => handleSelectChange('virtualBackground', e.target.value)}
              className="background-select"
              disabled={loading}
            >
              <option value="">None</option>
              {aiBackgrounds.map(bg => (
                <option key={bg.id} value={bg.id}>{bg.name}</option>
              ))}
            </select>
          </div>

          <div className="background-previews">
            {aiBackgrounds.map(bg => (
              <div 
                key={bg.id} 
                className={`background-preview ${settings.virtualBackground === bg.id ? 'selected' : ''}`}
                onClick={() => handleSelectChange('virtualBackground', bg.id)}
              >
                <div className={`preview-image ${bg.preview}`}></div>
                <span>{bg.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Meeting Notifications</span>
              <span className="setting-description">Receive alerts for meeting events</span>
            </div>
            <button 
              className={`toggle-button ${settings.notifications ? 'on' : 'off'}`}
              onClick={() => handleSettingChange('notifications')}
              disabled={loading}
            >
              {settings.notifications ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Language & Translation</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Language</span>
              <span className="setting-description">Select your preferred language</span>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
              className="language-select"
              disabled={loading}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Live Translation</span>
              <span className="setting-description">Translate meeting audio in real-time</span>
            </div>
            <button 
              className={`toggle-button ${settings.translation ? 'on' : 'off'}`}
              onClick={() => handleSettingChange('translation')}
              disabled={loading}
            >
              {settings.translation ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button 
            className="save-button"
            onClick={saveSettings}
            disabled={loading || !hasChanges}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;