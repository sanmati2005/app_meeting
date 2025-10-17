import React, { useState } from 'react';
import './ParticipantList.css';

const ParticipantList = ({ 
  participants, 
  currentUser, 
  isHost, 
  onClose, 
  onMuteParticipant, 
  onRemoveParticipant,
  onSpotlightParticipant,
  onToggleHandRaise,
  formatDuration
}) => {
  const [showParticipantActions, setShowParticipantActions] = useState(null);

  const toggleMute = (id) => {
    onMuteParticipant(id);
    setShowParticipantActions(null); // Close actions menu after action
  };

  const toggleVideo = (id) => {
    console.log('Toggling video for participant:', id);
    setShowParticipantActions(null); // Close actions menu after action
  };

  const spotlightParticipant = (id) => {
    onSpotlightParticipant(id);
    setShowParticipantActions(null); // Close actions menu after action
  };

  const removeParticipant = (id) => {
    onRemoveParticipant(id);
    setShowParticipantActions(null); // Close actions menu after action
  };

  const toggleHandRaise = (id) => {
    onToggleHandRaise(id);
    setShowParticipantActions(null); // Close actions menu after action
  };

  return (
    <div className="participant-list-container">
      <div className="participant-header">
        <h3>Participants ({participants.length})</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="participant-search">
        <input 
          type="text" 
          placeholder="Search participants..." 
          className="search-input"
        />
      </div>

      <div className="participants-list">
        {participants.map(participant => {
          const isMe = participant.id === currentUser;
          const isHostParticipant = participant.role === 'host';
          
          return (
            <div 
              key={participant.id} 
              className={`participant-item ${participant.isSpotlighted ? 'spotlighted' : ''}`}
            >
              <div className="participant-info">
                <div className="participant-avatar">
                  {participant.name.charAt(0)}
                </div>
                <div className="participant-details">
                  <div className="participant-name">
                    {participant.name}
                    {isMe && <span className="you-badge">You</span>}
                    {isHostParticipant && (
                      <span className="host-badge">Host</span>
                    )}
                  </div>
                  <div className="participant-status">
                    {participant.isMuted ? 'Muted' : 'Unmuted'} • 
                    {participant.isVideoOn ? ' Video On' : ' Video Off'}
                    {participant.handRaised && ' • ✋ Raising hand'}
                  </div>
                  <div className="participant-duration">
                    Time: {formatDuration ? formatDuration(participant.duration) : `${participant.duration || 0}s`}
                  </div>
                </div>
              </div>

              <div className="participant-controls">
                {participant.handRaised && (
                  <button 
                    className="control-btn hand-raised"
                    onClick={() => toggleHandRaise(participant.id)}
                    title="Lower hand"
                  >
                    ✋
                  </button>
                )}

                <button 
                  className="control-btn"
                  onClick={() => setShowParticipantActions(
                    showParticipantActions === participant.id ? null : participant.id
                  )}
                >
                  ⋮
                </button>
              </div>

              {showParticipantActions === participant.id && (
                <div className="participant-actions">
                  <button onClick={() => toggleMute(participant.id)}>
                    {participant.isMuted ? 'Unmute' : 'Mute'}
                  </button>
                  <button onClick={() => toggleVideo(participant.id)}>
                    {participant.isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
                  </button>
                  <button onClick={() => spotlightParticipant(participant.id)}>
                    Spotlight
                  </button>
                  {isHost && !isHostParticipant && !isMe && (
                    <button 
                      className="danger"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      Remove Participant
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="participant-footer">
        <button className="invite-btn" onClick={() => {
          const roomId = window.location.pathname.split('/').pop();
          const inviteLink = `${window.location.origin}/room/${roomId}`;
          navigator.clipboard.writeText(inviteLink).then(() => {
            alert('Invite link copied to clipboard!');
          }).catch(() => {
            prompt('Copy this link to invite others:', inviteLink);
          });
        }}>
          + Invite Others
        </button>
      </div>
    </div>
  );
};

export default ParticipantList;