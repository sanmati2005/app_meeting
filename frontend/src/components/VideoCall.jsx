import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import ParticipantList from './ParticipantList';
import HostControls from './HostControls';
import './VideoCall.css';

const VideoCall = () => {
  const { roomId } = useParams();
  const [stream, setStream] = useState(null);
  const [joined, setJoined] = useState(false);
  const [userId] = useState(Math.random().toString(36).substr(2, 9));
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const userVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Load meeting info
  useEffect(() => {
    const fetchMeetingInfo = async () => {
      if (roomId) {
        try {
          const response = await api.getMeeting(roomId);
          if (response.success) {
            setMeetingInfo(response.meeting);
            // Check if current user is the host
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const isUserHost = response.meeting.host._id === currentUser._id;
            setIsHost(isUserHost);
            
            // Initialize participants from meeting info
            if (response.meeting.participants) {
              const formattedParticipants = response.meeting.participants.map(p => {
                // Determine if this participant is the host
                const isParticipantHost = p.user && p.user._id === response.meeting.host._id;
                
                return {
                  id: p.user ? p.user._id : `temp-${Math.random()}`,
                  name: p.name || (p.user ? p.user.name : 'Unknown'),
                  isMuted: p.isMuted || false,
                  isVideoOn: p.isVideoOn !== undefined ? p.isVideoOn : true,
                  isSpotlighted: p.isSpotlighted || false,
                  handRaised: p.handRaised || false,
                  role: isParticipantHost ? 'host' : (p.role || 'participant'),
                  joinedAt: p.joinedAt || null,
                  leftAt: p.leftAt || null,
                  duration: p.duration || 0
                };
              });
              setParticipants(formattedParticipants);
            }
          }
        } catch (error) {
          console.error('Failed to fetch meeting info:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMeetingInfo();
  }, [roomId]);

  // Get user media
  const getUserMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
      }
      return mediaStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera or microphone. Please check permissions and ensure you are using HTTPS or localhost.');
      return null;
    }
  };

  // Initialize WebSocket connection
  const initWebSocket = () => {
    // Connect to the WebSocket server
    const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    console.log('Connecting to WebSocket server:', SOCKET_URL);
    
    // For production, we might need to use a different approach
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server with ID:', socketRef.current.id);
      
      // Join the room
      socketRef.current.emit('join-room', roomId, userId);
    });
    
    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
    
    socketRef.current.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });
    
    socketRef.current.on('user-connected', (userId) => {
      console.log('User connected:', userId);
      const joinTime = new Date();
      
      // Determine if this new participant is the host
      let role = 'participant';
      if (meetingInfo && userId === meetingInfo.host._id) {
        role = 'host';
      }
      
      setParticipants(prev => [...prev, { 
        id: userId, 
        name: `Participant ${prev.length + 1}`,
        isMuted: false,
        isVideoOn: true,
        isSpotlighted: false,
        handRaised: false,
        role: role,
        joinedAt: joinTime,
        duration: 0
      }]);
    });
    
    socketRef.current.on('participant-joined', (data) => {
      const { userId, joinTime } = data;
      setParticipants(prev => 
        prev.map(participant => 
          participant.id === userId 
            ? { ...participant, joinedAt: joinTime } 
            : participant
        )
      );
    });
    
    socketRef.current.on('user-disconnected', (userId) => {
      console.log('User disconnected:', userId);
      const leaveTime = new Date();
      setParticipants(prev => 
        prev.map(participant => 
          participant.id === userId 
            ? { ...participant, leftAt: leaveTime } 
            : participant
        )
      );
    });
    
    // Handle participant mute status change
    socketRef.current.on('participant-muted', (data) => {
      const { userId, muted } = data;
      setParticipants(prev => 
        prev.map(participant => 
          participant.id === userId 
            ? { ...participant, isMuted: muted } 
            : participant
        )
      );
    });
    
    // Handle participant video status change
    socketRef.current.on('participant-video-changed', (data) => {
      const { userId, videoOff } = data;
      setParticipants(prev => 
        prev.map(participant => 
          participant.id === userId 
            ? { ...participant, isVideoOn: !videoOff } 
            : participant
        )
      );
    });
    
    // Handle hand raise
    socketRef.current.on('participant-hand-raised', (data) => {
      const { userId, raised } = data;
      setParticipants(prev => 
        prev.map(participant => 
          participant.id === userId 
            ? { ...participant, handRaised: raised } 
            : participant
        )
      );
    });
    
    // Handle participant removal
    socketRef.current.on('participant-removed', (data) => {
      const { participantId } = data;
      setParticipants(prev => prev.filter(participant => participant.id !== participantId));
      
      // If this is the current user being removed, show a message and redirect
      if (participantId === userId) {
        alert('You have been removed from the meeting by the host.');
        leaveRoom();
      }
    });
    
    // Handle being removed by host
    socketRef.current.on('you-were-removed', (data) => {
      const { roomId } = data;
      alert('You have been removed from the meeting by the host.');
      leaveRoom();
    });

    // Handle spotlight participant
    socketRef.current.on('participant-spotlighted', (data) => {
      const { participantId, spotlighted } = data;
      setParticipants(prev => 
        prev.map(participant => 
          participant.id === participantId 
            ? { ...participant, isSpotlighted: spotlighted } 
            : { ...participant, isSpotlighted: false }
        )
      );
    });
    
    // Handle live transcription
    socketRef.current.on('transcript-update', (data) => {
      const { speaker, text, timestamp } = data;
      setTranscript(prev => [...prev, { speaker, text, timestamp }]);
    });
    
    // Handle WebRTC signaling
    socketRef.current.on('offer', (offer) => {
      console.log('Received offer');
    });
    
    socketRef.current.on('answer', (answer) => {
      console.log('Received answer');
    });
    
    socketRef.current.on('ice-candidate', (candidate) => {
      console.log('Received ICE candidate');
    });
  };

  // Join room
  const joinRoom = async () => {
    if (roomId) {
      const mediaStream = await getUserMedia();
      if (mediaStream) {
        setJoined(true);
        initWebSocket();
        console.log(`Joining room: ${roomId}`);
        
        // Update join time on backend
        try {
          const joinTime = new Date();
          if (meetingInfo) {
            // Determine if current user is the host
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const isCurrentUserHost = meetingInfo.host._id === currentUser._id;
            
            await api.fetch(`/api/meetings/${meetingInfo._id}/participant/${userId}/join-time`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ 
                joinedAt: joinTime,
                role: isCurrentUserHost ? 'host' : 'participant'
              })
            });
          }
        } catch (error) {
          console.error('Failed to update join time:', error);
        }
      }
    }
  };

  // Leave room
  const leaveRoom = async () => {
    setJoined(false);
    
    // Update leave time on backend
    try {
      const leaveTime = new Date();
      if (meetingInfo) {
        await api.fetch(`/api/meetings/${meetingInfo._id}/participant/${userId}/leave-time`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ leftAt: leaveTime })
        });
      }
    } catch (error) {
      console.error('Failed to update leave time:', error);
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    // Close WebSocket connection
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Update meeting status if needed
    if (meetingInfo) {
      try {
        await api.fetch(`/api/meetings/${meetingInfo._id}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status: 'completed' })
        });
      } catch (error) {
        console.error('Failed to update meeting status:', error);
      }
    }
    
    navigate('/');
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newMuteState = !audioTrack.enabled;
        setIsMuted(newMuteState);
        
        // Notify other participants of mute status change
        if (socketRef.current) {
          socketRef.current.emit('mute-status-change', { roomId, userId, muted: newMuteState });
        }
      }
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newVideoState = !videoTrack.enabled;
        setIsVideoOff(newVideoState);
        
        // Notify other participants of video status change
        if (socketRef.current) {
          socketRef.current.emit('video-status-change', { roomId, userId, videoOff: newVideoState });
        }
      }
    }
  };

  // End call
  const endCall = () => {
    leaveRoom();
  };

  // Share screen
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = screenStream;
      }
      
      // Replace video track in the original stream
      if (stream) {
        const screenTrack = screenStream.getVideoTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];
        stream.removeTrack(videoTrack);
        stream.addTrack(screenTrack);
        
        // Stop screen sharing when user stops it
        screenTrack.onended = () => {
          if (stream && userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        };
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  // Invite participants
  const inviteParticipants = () => {
    const inviteLink = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('Invite link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link to invite others:', inviteLink);
    });
  };

  // Start/Stop recording
  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        // Start recording
        const response = await api.fetch(`/api/transcription/${meetingInfo._id}/start`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        
        if (response.success) {
          setIsRecording(true);
          alert('Recording started');
        }
      } else {
        // Stop recording
        const response = await api.fetch(`/api/transcription/${meetingInfo._id}/stop`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        
        if (response.success) {
          setIsRecording(false);
          alert('Recording stopped');
        }
      }
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to toggle recording: ' + (error.message || 'Unknown error'));
    }
  };

  // Generate transcript
  const generateTranscript = async () => {
    try {
      const response = await api.fetch(`/api/transcription/${meetingInfo._id}/transcript`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response.success) {
        // Format the transcript properly
        const formattedTranscript = response.transcript.split('\n').filter(line => line.trim() !== '').map((line, index) => {
          // Try to parse speaker and text from the line
          const parts = line.split(':');
          if (parts.length >= 2) {
            return {
              speaker: parts[0].trim(),
              text: parts.slice(1).join(':').trim(),
              timestamp: new Date()
            };
          }
          return {
            speaker: `Participant ${index % 3 + 1}`,
            text: line.trim(),
            timestamp: new Date()
          };
        });
        
        setTranscript(formattedTranscript);
        alert('Transcript generated');
      }
    } catch (error) {
      console.error('Transcript generation error:', error);
      alert('Failed to generate transcript: ' + (error.message || 'Unknown error'));
    }
  };

  // Mute participant
  const muteParticipant = async (participantId) => {
    try {
      // Find the participant to get their current mute state
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;
      
      const newMuteState = !participant.isMuted;
      
      // Update participant locally first
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, isMuted: newMuteState } 
            : p
        )
      );
      
      // Notify via WebSocket
      if (socketRef.current) {
        socketRef.current.emit('mute-status-change', { roomId, userId: participantId, muted: newMuteState });
      }
      
      // If host, also update on backend
      if (isHost && meetingInfo) {
        await api.fetch(`/api/meetings/${meetingInfo._id}/participant/${participantId}/mute`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ muted: newMuteState })
        });
      }
    } catch (error) {
      console.error('Failed to mute participant:', error);
    }
  };

  // Remove participant
  const removeParticipant = async (participantId) => {
    try {
      // Confirm removal
      const confirmed = window.confirm('Are you sure you want to remove this participant from the meeting?');
      if (!confirmed) return;
      
      // Update participant locally first
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      
      // Notify via WebSocket
      if (socketRef.current) {
        socketRef.current.emit('remove-participant', { roomId, participantId });
      }
      
      // If host, also update on backend
      if (isHost && meetingInfo) {
        const response = await api.fetch(`/api/meetings/${meetingInfo._id}/participant/${participantId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        
        if (response.success) {
          console.log('Participant removed successfully');
        } else {
          console.error('Failed to remove participant from backend:', response.message);
          // In a real app, you might want to show an error message to the user
        }
      }
    } catch (error) {
      console.error('Failed to remove participant:', error);
      // Revert local change if backend update failed
      // In a real app, you might want to show an error message to the user
    }
  };

  // Spotlight participant
  const spotlightParticipant = async (participantId) => {
    try {
      // Find the participant to get their current spotlight state
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;
      
      const newSpotlightState = !participant.isSpotlighted;
      
      // Update participant locally first
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, isSpotlighted: newSpotlightState } 
            : { ...p, isSpotlighted: false }
        )
      );
      
      // Notify via WebSocket
      if (socketRef.current) {
        socketRef.current.emit('spotlight-participant', { roomId, participantId, spotlighted: newSpotlightState });
      }
      
      // If host, also update on backend
      if (isHost && meetingInfo) {
        await api.fetch(`/api/meetings/${meetingInfo._id}/participant/${participantId}/spotlight`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ spotlighted: newSpotlightState })
        });
      }
    } catch (error) {
      console.error('Failed to spotlight participant:', error);
    }
  };

  // Toggle hand raise
  const toggleHandRaise = async (participantId) => {
    try {
      // Find the participant to get their current hand raise state
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;
      
      const newHandRaiseState = !participant.handRaised;
      
      // Update participant locally first
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, handRaised: newHandRaiseState } 
            : p
        )
      );
      
      // Notify via WebSocket
      if (socketRef.current) {
        socketRef.current.emit('hand-raise', { roomId, userId: participantId, raised: newHandRaiseState });
      }
      
      // Also update on backend
      if (meetingInfo) {
        await api.fetch(`/api/meetings/${meetingInfo._id}/participant/${participantId}/hand`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ handRaised: newHandRaiseState })
        });
      }
    } catch (error) {
      console.error('Failed to toggle hand raise:', error);
    }
  };

  // Format participant duration
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Update participant durations periodically
  useEffect(() => {
    if (joined && participants.length > 0) {
      const interval = setInterval(() => {
        setParticipants(prev => 
          prev.map(participant => {
            if (participant.joinedAt && !participant.leftAt) {
              const durationMs = new Date() - new Date(participant.joinedAt);
              const duration = Math.floor(durationMs / 1000);
              return { ...participant, duration };
            }
            return participant;
          })
        );
      }, 1000); // Update every second
      
      return () => clearInterval(interval);
    }
  }, [joined, participants]);

  useEffect(() => {
    if (roomId && !loading) {
      joinRoom();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, loading]);

  if (loading) {
    return (
      <div className="video-call-container">
        <div className="loading">Loading meeting information...</div>
      </div>
    );
  }

  return (
    <div className="video-call-container">
      <div className="video-header">
        <h2>{meetingInfo?.title || 'AI Meeting Room'}</h2>
        {joined ? (
          <div className="room-info">
            <span>Room ID: {roomId}</span>
            <button onClick={leaveRoom}>Leave Room</button>
          </div>
        ) : (
          <div className="room-input">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId || ''}
              readOnly
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        )}
      </div>

      <div className="video-grid">
        {/* User's own video */}
        <div className="video-wrapper">
          <video ref={userVideoRef} autoPlay muted playsInline />
          <div className="video-controls">
            <button onClick={toggleAudio}>{isMuted ? '🔇' : '🎤'}</button>
            <button onClick={toggleVideo}>{isVideoOff ? '🎥' : '📷'}</button>
          </div>
          <div className="participant-name">You</div>
        </div>

        {/* Remote participants - in a real app, these would be dynamically generated */}
        {participants.filter(p => p.id !== userId).map((participant, index) => (
          <div className="video-wrapper" key={participant.id}>
            <video ref={index === 0 ? remoteVideoRef : null} autoPlay playsInline />
            <div className="participant-name">
              {participant.name} ({formatDuration(participant.duration)})
            </div>
          </div>
        ))}
        
        {/* Placeholder for additional participants */}
        {participants.filter(p => p.id !== userId).length === 0 && (
          <>
            <div className="video-wrapper placeholder">
              <div className="placeholder-content">
                <span>Participant 1</span>
              </div>
            </div>
            
            <div className="video-wrapper placeholder">
              <div className="placeholder-content">
                <span>Participant 2</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live Transcript */}
      {transcript.length > 0 && (
        <div className="transcript-container">
          <h3>Live Transcript</h3>
          <div className="transcript-content">
            {transcript.map((entry, index) => (
              <div key={index} className="transcript-entry">
                <span className="speaker">{entry.speaker}:</span>
                <span className="text">{entry.text}</span>
                <span className="timestamp">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main controls */}
      <div className="main-controls">
        <button className="control-button end-call" onClick={endCall}>🛑 End Call</button>
        <button className="control-button mic" onClick={toggleAudio}>
          {isMuted ? '🔇 Unmute' : '🎤 Mute'}
        </button>
        <button className="control-button video" onClick={toggleVideo}>
          {isVideoOff ? '🎥 Start Video' : '📷 Stop Video'}
        </button>
        <button className="control-button share" onClick={shareScreen}>💻 Share Screen</button>
        <button className="control-button participants" onClick={() => setShowParticipants(!showParticipants)}>
          👥 Participants ({participants.length})
        </button>
        <button className="control-button invite" onClick={inviteParticipants}>
          📨 Invite
        </button>
        <button className="control-button record" onClick={toggleRecording}>
          {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
        </button>
        <button className="control-button transcript" onClick={generateTranscript}>
          📝 Generate Transcript
        </button>
      </div>

      {/* Participant list */}
      {showParticipants && (
        <div className="participants-overlay">
          <ParticipantList 
            participants={participants}
            currentUser={userId}
            isHost={isHost}
            onClose={() => setShowParticipants(false)}
            onMuteParticipant={muteParticipant}
            onRemoveParticipant={removeParticipant}
            onSpotlightParticipant={spotlightParticipant}
            onToggleHandRaise={toggleHandRaise}
            formatDuration={formatDuration}
          />
        </div>
      )}

      {/* Host controls */}
      {isHost && (
        <div className="host-controls-overlay">
          <HostControls 
            isRecording={isRecording}
            onToggleRecording={toggleRecording}
            onMuteAll={() => {}}
            onEndMeeting={endCall}
          />
        </div>
      )}
    </div>
  );
};

export default VideoCall;