import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MeetingRoom.css';

const MeetingRoom = () => {
  const [meetings, setMeetings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  // Generate a random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Load meetings from backend on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setFetching(true);
        setError('');
        
        // Try to get meetings from backend
        const response = await api.getMeetings();
        if (response.success) {
          setMeetings(response.meetings || []);
        } else {
          // Fallback to localStorage if backend fails
          const savedMeetings = localStorage.getItem('meetings');
          if (savedMeetings) {
            setMeetings(JSON.parse(savedMeetings));
          }
        }
      } catch (err) {
        console.error('Failed to fetch meetings:', err);
        setError('Failed to load meetings. Please try again.');
        // Fallback to localStorage if backend fails
        const savedMeetings = localStorage.getItem('meetings');
        if (savedMeetings) {
          setMeetings(JSON.parse(savedMeetings));
        }
      } finally {
        setFetching(false);
      }
    };

    fetchMeetings();
  }, []);

  // Save meetings to localStorage as fallback
  useEffect(() => {
    if (meetings.length > 0) {
      localStorage.setItem('meetings', JSON.stringify(meetings));
    }
  }, [meetings]);

  const handleCreateMeeting = async () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      try {
        setLoading(true);
        setError('');
        
        // Try to create meeting on backend
        const meetingData = {
          title: newMeeting.title,
          description: newMeeting.description,
          scheduledFor: `${newMeeting.date}T${newMeeting.time}`,
          duration: newMeeting.duration,
          settings: {
            waitingRoom: true,
            muteOnEntry: false,
            enableChat: true,
            enableRecording: false,
            enableTranscription: true
          }
        };
        
        const response = await api.createMeeting(meetingData);
        
        if (response.success) {
          setMeetings([...meetings, response.meeting]);
        } else {
          throw new Error(response.message || 'Failed to create meeting');
        }
      } catch (err) {
        console.error('Failed to create meeting:', err);
        setError(err.message || 'Failed to create meeting. Please try again.');
      } finally {
        setLoading(false);
        setNewMeeting({ title: '', date: '', time: '', duration: 60, description: '' });
        setShowCreateForm(false);
      }
    }
  };

  const deleteMeeting = async (id) => {
    try {
      // Try to delete meeting on backend
      const response = await api.deleteMeeting(id);
      
      if (response.success) {
        setMeetings(meetings.filter(meeting => meeting._id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete meeting');
      }
    } catch (err) {
      console.error('Failed to delete meeting:', err);
      setError(err.message || 'Failed to delete meeting. Please try again.');
      // Fallback to local deletion if backend fails
      setMeetings(meetings.filter(meeting => meeting._id !== id));
    }
  };

  const joinMeeting = (roomId) => {
    // In a real app, you would navigate to the video call page
    navigate(`/room/${roomId}`);
  };

  const startInstantMeeting = () => {
    const roomId = generateRoomId();
    // For instant meetings, we'll create a temporary meeting object
    const instantMeeting = {
      _id: `temp-${Date.now()}`,
      meetingId: roomId,
      title: 'Instant Meeting',
      scheduledFor: new Date().toISOString(),
      duration: 60,
      status: 'in-progress'
    };
    setMeetings([...meetings, instantMeeting]);
    joinMeeting(roomId);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (fetching) {
    return (
      <div className="meeting-room-container">
        <div className="loading">Loading meetings...</div>
      </div>
    );
  }

  return (
    <div className="meeting-room-container">
      <div className="meeting-header">
        <h2>Scheduled Meetings</h2>
        <div className="header-actions">
          <button 
            className="create-meeting-btn"
            onClick={startInstantMeeting}
          >
            + Start Instant Meeting
          </button>
          <button 
            className="create-meeting-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Schedule Meeting'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="create-meeting-form">
          <h3>Create New Meeting</h3>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Meeting Title</label>
            <input
              type="text"
              placeholder="Team Standup, Client Meeting, etc."
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                min="15"
                max="840"
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value) || 60})}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              placeholder="Add a description for your meeting"
              value={newMeeting.description}
              onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
            />
          </div>
          
          <button 
            className="submit-btn" 
            onClick={handleCreateMeeting}
            disabled={loading}
          >
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      )}

      <div className="meetings-list">
        {meetings.length === 0 ? (
          <div className="empty-state">
            <p>No meetings scheduled yet</p>
            <button onClick={startInstantMeeting}>
              Start your first meeting
            </button>
          </div>
        ) : (
          meetings.map(meeting => (
            <div key={meeting._id} className="meeting-card">
              <div className="meeting-info">
                <h3>{meeting.title}</h3>
                <p>📅 {formatDateTime(meeting.scheduledFor)}</p>
                <p>⏱️ {meeting.duration} minutes</p>
                <p>🆔 Meeting ID: {meeting.meetingId || meeting.roomId}</p>
                {meeting.description && <p>📝 {meeting.description}</p>}
                <p>📊 Status: {meeting.status || 'scheduled'}</p>
              </div>
              <div className="meeting-actions">
                <button 
                  className="join-btn" 
                  onClick={() => joinMeeting(meeting.meetingId || meeting.roomId)}
                >
                  Join
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteMeeting(meeting._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;