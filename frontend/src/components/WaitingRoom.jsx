import React, { useState } from 'react';
import './WaitingRoom.css';

const WaitingRoom = () => {
  const [passcode] = useState('');
  const [waitingParticipants, setWaitingParticipants] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', joinTime: '2:30 PM' },
    { id: 2, name: 'Maria Garcia', email: 'maria@example.com', joinTime: '2:32 PM' },
    { id: 3, name: 'Robert Wilson', email: 'robert@example.com', joinTime: '2:35 PM' }
  ]);

  const admitParticipant = (id) => {
    setWaitingParticipants(prev => prev.filter(p => p.id !== id));
  };

  const denyParticipant = (id) => {
    setWaitingParticipants(prev => prev.filter(p => p.id !== id));
  };

  const admitAll = () => {
    setWaitingParticipants([]);
  };

  return (
    <div className="waiting-room-container">
      <div className="waiting-room-header">
        <h2>🔒 Waiting Room</h2>
        <p>Manage participants before they join the meeting</p>
      </div>

      <div className="passcode-section">
        <h3>Meeting Passcode</h3>
        <div className="passcode-display">
          <span className="passcode">{passcode || '123456'}</span>
          <button className="copy-btn">📋 Copy</button>
        </div>
        <button className="regenerate-btn">↻ Regenerate Passcode</button>
      </div>

      <div className="waiting-participants">
        <div className="participants-header">
          <h3>Waiting Participants ({waitingParticipants.length})</h3>
          {waitingParticipants.length > 0 && (
            <button className="admit-all-btn" onClick={admitAll}>
              Admit All
            </button>
          )}
        </div>

        {waitingParticipants.length === 0 ? (
          <div className="empty-state">
            <p>No participants waiting to join</p>
          </div>
        ) : (
          <div className="participants-list">
            {waitingParticipants.map(participant => (
              <div key={participant.id} className="participant-card">
                <div className="participant-info">
                  <div className="participant-avatar">
                    {participant.name.charAt(0)}
                  </div>
                  <div className="participant-details">
                    <div className="participant-name">{participant.name}</div>
                    <div className="participant-email">{participant.email}</div>
                    <div className="participant-time">Requested to join at {participant.joinTime}</div>
                  </div>
                </div>
                <div className="participant-actions">
                  <button 
                    className="admit-btn"
                    onClick={() => admitParticipant(participant.id)}
                  >
                    Admit
                  </button>
                  <button 
                    className="deny-btn"
                    onClick={() => denyParticipant(participant.id)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;