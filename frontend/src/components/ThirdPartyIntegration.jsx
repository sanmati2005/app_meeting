import React, { useState } from 'react';
import './ThirdPartyIntegration.css';

const ThirdPartyIntegration = () => {
  const [connectedApps, setConnectedApps] = useState([
    { id: 1, name: 'Google Drive', icon: '📁', connected: true, color: '#4285f4' },
    { id: 2, name: 'Microsoft Teams', icon: '💬', connected: false, color: '#6264a7' },
    { id: 3, name: 'Slack', icon: '🤖', connected: true, color: '#4a154b' },
    { id: 4, name: 'Notion', icon: '📝', connected: false, color: '#000000' },
    { id: 5, name: 'Airtable', icon: '📊', connected: false, color: '#18bfff' }
  ]);

  const [showIntegrationForm, setShowIntegrationForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const toggleConnection = (id) => {
    setConnectedApps(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, connected: !app.connected } 
          : app
      )
    );
  };

  const connectApp = (app) => {
    setSelectedApp(app);
    setShowIntegrationForm(true);
  };

  const handleIntegration = () => {
    if (selectedApp) {
      toggleConnection(selectedApp.id);
      setShowIntegrationForm(false);
      setSelectedApp(null);
    }
  };

  return (
    <div className="integration-container">
      <div className="integration-header">
        <h2>🔗 Third-Party Integrations</h2>
        <p>Connect with your favorite productivity tools</p>
      </div>

      <div className="apps-grid">
        {connectedApps.map(app => (
          <div key={app.id} className="app-card">
            <div className="app-header">
              <div className="app-icon" style={{ color: app.color }}>
                {app.icon}
              </div>
              <h3>{app.name}</h3>
            </div>
            
            <div className="app-status">
              {app.connected ? (
                <span className="status connected">Connected</span>
              ) : (
                <span className="status disconnected">Not Connected</span>
              )}
            </div>
            
            <div className="app-actions">
              {app.connected ? (
                <button 
                  className="action-btn disconnect"
                  onClick={() => toggleConnection(app.id)}
                >
                  Disconnect
                </button>
              ) : (
                <button 
                  className="action-btn connect"
                  onClick={() => connectApp(app)}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showIntegrationForm && (
        <div className="integration-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Connect to {selectedApp?.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowIntegrationForm(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="integration-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Authorize Access</h4>
                    <p>Grant permission to access your {selectedApp?.name} account</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Configure Settings</h4>
                    <p>Choose what data to sync and how often</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Complete Setup</h4>
                    <p>Finish the integration process</p>
                  </div>
                </div>
              </div>
              
              <div className="oauth-buttons">
                <button className="oauth-btn google">
                  <span className="oauth-icon">🇬</span>
                  Continue with Google
                </button>
                <button className="oauth-btn microsoft">
                  <span className="oauth-icon">🇲</span>
                  Continue with Microsoft
                </button>
              </div>
              
              <button 
                className="primary-btn"
                onClick={handleIntegration}
              >
                Connect to {selectedApp?.name}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="integration-features">
        <h3>Integration Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📂</div>
            <h4>File Sharing</h4>
            <p>Share documents directly from Google Drive or OneDrive</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h4>Task Sync</h4>
            <p>Sync action items with Notion or Airtable</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📢</div>
            <h4>Team Notifications</h4>
            <p>Send meeting summaries to Slack or Teams</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Analytics</h4>
            <p>Export engagement data to your analytics tools</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyIntegration;