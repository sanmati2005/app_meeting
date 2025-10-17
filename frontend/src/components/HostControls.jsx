import React, { useState } from 'react';
import './HostControls.css';

const HostControls = ({ 
  isRecording, 
  onToggleRecording, 
  onMuteAll, 
  onEndMeeting 
}) => {
  const [isMutedAll, setIsMutedAll] = useState(false);
  const [isVideoOffAll, setIsVideoOffAll] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    waitingRoom: true,
    passcode: true,
    muteOnEntry: false,
    disableChat: false,
    disableVideo: false,
    lockMeeting: false
  });

  const toggleRecording = () => {
    onToggleRecording();
  };

  const muteAllParticipants = () => {
    const newState = !isMutedAll;
    setIsMutedAll(newState);
    onMuteAll(newState);
  };

  const turnOffAllVideos = () => {
    const newState = !isVideoOffAll;
    setIsVideoOffAll(newState);
    // In a real app, this would send a signal to turn off all videos
    console.log('Turning off all videos:', newState);
  };

  const endMeeting = () => {
    if (window.confirm('Are you sure you want to end this meeting for all participants?')) {
      onEndMeeting();
    }
  };

  const toggleSecuritySetting = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // In a real app, this would update the meeting settings
    console.log('Toggling security setting:', setting);
  };

  const securityOptions = [
    { id: 'waitingRoom', label: 'Enable Waiting Room', enabled: securitySettings.waitingRoom },
    { id: 'passcode', label: 'Require Meeting Passcode', enabled: securitySettings.passcode },
    { id: 'muteOnEntry', label: 'Mute Participants on Entry', enabled: securitySettings.muteOnEntry },
    { id: 'disableChat', label: 'Disable Chat for Participants', enabled: securitySettings.disableChat },
    { id: 'disableVideo', label: 'Disable Video for Participants', enabled: securitySettings.disableVideo },
    { id: 'lockMeeting', label: 'Lock Meeting', enabled: securitySettings.lockMeeting }
  ];

  return (
    <div className="host-controls-container">
      <div className="controls-header">
        <h3>👑 Host Controls</h3>
        <p>Manage your meeting settings and participants</p>
      </div>

      <div className="main-controls">
        <button 
          className={`control-btn ${isRecording ? 'active recording' : ''}`}
          onClick={toggleRecording}
        >
          <span className="btn-icon">🔴</span>
          <span className="btn-label">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        <button 
          className={`control-btn ${isMutedAll ? 'active' : ''}`}
          onClick={muteAllParticipants}
        >
          <span className="btn-icon">🔇</span>
          <span className="btn-label">{isMutedAll ? 'Unmute All' : 'Mute All'}</span>
        </button>

        <button 
          className={`control-btn ${isVideoOffAll ? 'active' : ''}`}
          onClick={turnOffAllVideos}
        >
          <span className="btn-icon">🎥</span>
          <span className="btn-label">{isVideoOffAll ? 'Enable All Video' : 'Disable All Video'}</span>
        </button>

        <button 
          className="control-btn"
          onClick={() => setShowSecurityPanel(!showSecurityPanel)}
        >
          <span className="btn-icon">🔒</span>
          <span className="btn-label">Security</span>
        </button>

        <button 
          className="control-btn danger"
          onClick={endMeeting}
        >
          <span className="btn-icon">⏹️</span>
          <span className="btn-label">End Meeting</span>
        </button>
      </div>

      {showSecurityPanel && (
        <div className="security-panel">
          <div className="panel-header">
            <h4>Security Settings</h4>
            <button 
              className="close-panel-btn"
              onClick={() => setShowSecurityPanel(false)}
            >
              ×
            </button>
          </div>
          
          <div className="security-options">
            {securityOptions.map(option => (
              <div key={option.id} className="security-option">
                <div className="option-info">
                  <span className="option-label">{option.label}</span>
                </div>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${option.enabled ? 'on' : 'off'}`}
                    onClick={() => toggleSecuritySetting(option.id)}
                  >
                    {option.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="security-actions">
            <button className="security-action-btn">
              🚪 Remove Participant
            </button>
            <button className="security-action-btn">
              🚫 Ban Participant
            </button>
          </div>
        </div>
      )}

      <div className="meeting-info">
        <div className="info-item">
          <span className="info-label">Participants</span>
          <span className="info-value">12</span>
        </div>
        <div className="info-item">
          <span className="info-label">Duration</span>
          <span className="info-value">42:15</span>
        </div>
        <div className="info-item">
          <span className="info-label">Recording</span>
          <span className={`info-value ${isRecording ? 'recording' : ''}`}>
            {isRecording ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HostControls;