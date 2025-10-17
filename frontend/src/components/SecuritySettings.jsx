import React, { useState } from 'react';
import './SecuritySettings.css';

const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    enableEncryption: true,
    waitingRoom: true,
    muteOnEntry: false,
    enableChat: true,
    enableRecording: false,
    passcodeRequired: true,
    passcode: 'A1B2C3'
  });

  const [showPasscode, setShowPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');

  const toggleSetting = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const generateNewPasscode = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let passcode = '';
    for (let i = 0; i < 6; i++) {
      passcode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecuritySettings(prev => ({
      ...prev,
      passcode
    }));
  };

  const updatePasscode = () => {
    if (newPasscode.length === 6) {
      setSecuritySettings(prev => ({
        ...prev,
        passcode: newPasscode
      }));
      setNewPasscode('');
    }
  };

  return (
    <div className="security-settings-container">
      <div className="security-header">
        <h2>🔒 Security Settings</h2>
        <p>Manage meeting security and privacy options</p>
      </div>

      <div className="security-options">
        <div className="security-section">
          <h3>Meeting Security</h3>
          <div className="security-option">
            <div className="option-info">
              <div className="option-title">End-to-End Encryption</div>
              <div className="option-description">Encrypt meeting data for enhanced privacy</div>
            </div>
            <div className="option-toggle">
              <button 
                className={`toggle-btn ${securitySettings.enableEncryption ? 'on' : 'off'}`}
                onClick={() => toggleSetting('enableEncryption')}
              >
                {securitySettings.enableEncryption ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Waiting Room</div>
              <div className="option-description">Participants wait for host approval before joining</div>
            </div>
            <div className="option-toggle">
              <button 
                className={`toggle-btn ${securitySettings.waitingRoom ? 'on' : 'off'}`}
                onClick={() => toggleSetting('waitingRoom')}
              >
                {securitySettings.waitingRoom ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Mute Participants on Entry</div>
              <div className="option-description">Automatically mute participants when they join</div>
            </div>
            <div className="option-toggle">
              <button 
                className={`toggle-btn ${securitySettings.muteOnEntry ? 'on' : 'off'}`}
                onClick={() => toggleSetting('muteOnEntry')}
              >
                {securitySettings.muteOnEntry ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="security-section">
          <h3>Participant Controls</h3>
          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Enable Chat</div>
              <div className="option-description">Allow participants to send chat messages</div>
            </div>
            <div className="option-toggle">
              <button 
                className={`toggle-btn ${securitySettings.enableChat ? 'on' : 'off'}`}
                onClick={() => toggleSetting('enableChat')}
              >
                {securitySettings.enableChat ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Enable Recording</div>
              <div className="option-description">Allow host to record the meeting</div>
            </div>
            <div className="option-toggle">
              <button 
                className={`toggle-btn ${securitySettings.enableRecording ? 'on' : 'off'}`}
                onClick={() => toggleSetting('enableRecording')}
              >
                {securitySettings.enableRecording ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="security-section">
          <h3>Meeting Passcode</h3>
          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Require Passcode</div>
              <div className="option-description">Participants must enter passcode to join</div>
            </div>
            <div className="option-toggle">
              <button 
                className={`toggle-btn ${securitySettings.passcodeRequired ? 'on' : 'off'}`}
                onClick={() => toggleSetting('passcodeRequired')}
              >
                {securitySettings.passcodeRequired ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {securitySettings.passcodeRequired && (
            <div className="passcode-section">
              <div className="passcode-display">
                <div className="passcode-label">Current Passcode:</div>
                <div className="passcode-value">
                  {showPasscode ? securitySettings.passcode : '••••••'}
                  <button 
                    className="reveal-btn"
                    onClick={() => setShowPasscode(!showPasscode)}
                  >
                    {showPasscode ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="passcode-actions">
                <button 
                  className="action-btn"
                  onClick={generateNewPasscode}
                >
                  Generate New Passcode
                </button>
                
                <div className="custom-passcode">
                  <input
                    type="text"
                    placeholder="Enter 6-digit passcode"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value.toUpperCase())}
                    maxLength="6"
                    className="passcode-input"
                  />
                  <button 
                    className="action-btn"
                    onClick={updatePasscode}
                    disabled={newPasscode.length !== 6}
                  >
                    Update Passcode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="security-section">
          <h3>Advanced Security</h3>
          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Lock Meeting</div>
              <div className="option-description">Prevent new participants from joining</div>
            </div>
            <div className="option-toggle">
              <button className="action-btn lock-btn">
                Lock Meeting
              </button>
            </div>
          </div>

          <div className="security-option">
            <div className="option-info">
              <div className="option-title">Security History</div>
              <div className="option-description">View security events and reports</div>
            </div>
            <div className="option-toggle">
              <button className="action-btn">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;