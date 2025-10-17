import React, { useState } from 'react';
import './CalendarIntegration.css';

const CalendarIntegration = () => {
  const [connectedCalendars, setConnectedCalendars] = useState([
    { id: 1, name: 'Google Calendar', connected: true, color: '#4285f4' },
    { id: 2, name: 'Outlook Calendar', connected: false, color: '#0078d4' }
  ]);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    description: '',
    calendar: 1
  });

  const toggleCalendarConnection = (id) => {
    setConnectedCalendars(prev => 
      prev.map(calendar => 
        calendar.id === id 
          ? { ...calendar, connected: !calendar.connected } 
          : calendar
      )
    );
  };

  const scheduleMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      // In a real app, this would integrate with the calendar API
      alert(`Meeting scheduled: ${newMeeting.title} on ${newMeeting.date} at ${newMeeting.time}`);
      setNewMeeting({
        title: '',
        date: '',
        time: '',
        duration: '60',
        description: '',
        calendar: 1
      });
      setShowScheduleForm(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>📅 Calendar Integration</h2>
        <p>Sync with your calendar and schedule meetings</p>
      </div>

      <div className="calendar-sections">
        <div className="calendar-connections">
          <h3>Connected Calendars</h3>
          <div className="calendars-list">
            {connectedCalendars.map(calendar => (
              <div key={calendar.id} className="calendar-item">
                <div className="calendar-info">
                  <div 
                    className="calendar-color"
                    style={{ backgroundColor: calendar.color }}
                  ></div>
                  <span className="calendar-name">{calendar.name}</span>
                </div>
                <button 
                  className={`toggle-btn ${calendar.connected ? 'connected' : 'disconnected'}`}
                  onClick={() => toggleCalendarConnection(calendar.id)}
                >
                  {calendar.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="upcoming-meetings">
          <div className="meetings-header">
            <h3>Upcoming Meetings</h3>
            <button 
              className="schedule-btn"
              onClick={() => setShowScheduleForm(!showScheduleForm)}
            >
              + Schedule Meeting
            </button>
          </div>

          {showScheduleForm && (
            <div className="schedule-form">
              <h4>Schedule New Meeting</h4>
              <div className="form-group">
                <label>Meeting Title</label>
                <input
                  type="text"
                  placeholder="Team Standup, Client Meeting, etc."
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Duration (min)</label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
                    className="form-input"
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Meeting agenda, notes, etc."
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Calendar</label>
                <select
                  value={newMeeting.calendar}
                  onChange={(e) => setNewMeeting({...newMeeting, calendar: parseInt(e.target.value)})}
                  className="form-input"
                >
                  {connectedCalendars
                    .filter(cal => cal.connected)
                    .map(cal => (
                      <option key={cal.id} value={cal.id}>{cal.name}</option>
                    ))
                  }
                </select>
              </div>
              
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowScheduleForm(false)}>
                  Cancel
                </button>
                <button className="schedule-submit-btn" onClick={scheduleMeeting}>
                  Schedule Meeting
                </button>
              </div>
            </div>
          )}

          <div className="meetings-list">
            <div className="meeting-item">
              <div className="meeting-time">
                <div className="date">Oct 12</div>
                <div className="time">10:00 AM</div>
              </div>
              <div className="meeting-details">
                <h4>Team Standup</h4>
                <p> Daily sync with development team</p>
                <div className="meeting-meta">
                  <span className="duration">30 min</span>
                  <span className="calendar-name">Google Calendar</span>
                </div>
              </div>
              <div className="meeting-actions">
                <button className="join-btn">Join</button>
              </div>
            </div>
            
            <div className="meeting-item">
              <div className="meeting-time">
                <div className="date">Oct 12</div>
                <div className="time">2:00 PM</div>
              </div>
              <div className="meeting-details">
                <h4>Client Presentation</h4>
                <p> Q3 results presentation to stakeholders</p>
                <div className="meeting-meta">
                  <span className="duration">60 min</span>
                  <span className="calendar-name">Google Calendar</span>
                </div>
              </div>
              <div className="meeting-actions">
                <button className="join-btn">Join</button>
              </div>
            </div>
            
            <div className="meeting-item">
              <div className="meeting-time">
                <div className="date">Oct 13</div>
                <div className="time">11:00 AM</div>
              </div>
              <div className="meeting-details">
                <h4>Product Review</h4>
                <p> Review new features with design team</p>
                <div className="meeting-meta">
                  <span className="duration">45 min</span>
                  <span className="calendar-name">Outlook Calendar</span>
                </div>
              </div>
              <div className="meeting-actions">
                <button className="join-btn">Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;