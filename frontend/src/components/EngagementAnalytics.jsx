import React, { useState } from 'react';
import './EngagementAnalytics.css';

const EngagementAnalytics = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for analytics
  const engagementData = {
    overview: {
      attendance: 87,
      avgAttention: 76,
      participation: 92,
      sentiment: 84
    },
    participants: [
      { id: 1, name: 'John Smith', attention: 92, participation: 88, sentiment: 85, role: 'host' },
      { id: 2, name: 'Sarah Johnson', attention: 85, participation: 95, sentiment: 90, role: 'participant' },
      { id: 3, name: 'Michael Chen', attention: 78, participation: 72, sentiment: 75, role: 'participant' },
      { id: 4, name: 'Emma Wilson', attention: 95, participation: 88, sentiment: 92, role: 'participant' },
      { id: 5, name: 'David Brown', attention: 65, participation: 58, sentiment: 60, role: 'participant' }
    ],
    timeline: [
      { time: '10:00', attention: 80, participation: 70 },
      { time: '10:15', attention: 85, participation: 75 },
      { time: '10:30', attention: 90, participation: 85 },
      { time: '10:45', attention: 75, participation: 65 },
      { time: '11:00', attention: 88, participation: 80 },
      { time: '11:15', attention: 92, participation: 88 }
    ]
  };

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'participants', label: 'Participants' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Engagement Analytics</h2>
        <p>Track participant engagement and meeting effectiveness</p>
      </div>

      <div className="analytics-controls">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="time-filter">
          {timeRanges.map(range => (
            <button
              key={range.id}
              className={`time-btn ${timeRange === range.id ? 'active' : ''}`}
              onClick={() => setTimeRange(range.id)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">👥</span>
                <h3>Attendance</h3>
              </div>
              <div className="metric-value">{engagementData.overview.attendance}%</div>
              <div className="metric-description">Average attendance rate</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">👁️</span>
                <h3>Attention</h3>
              </div>
              <div className="metric-value">{engagementData.overview.avgAttention}%</div>
              <div className="metric-description">Average attention level</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">💬</span>
                <h3>Participation</h3>
              </div>
              <div className="metric-value">{engagementData.overview.participation}%</div>
              <div className="metric-description">Active participation rate</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">😊</span>
                <h3>Sentiment</h3>
              </div>
              <div className="metric-value">{engagementData.overview.sentiment}%</div>
              <div className="metric-description">Positive sentiment score</div>
            </div>
          </div>
          
          <div className="sentiment-chart">
            <h3>Meeting Sentiment Analysis</h3>
            <div className="sentiment-bars">
              <div className="sentiment-bar">
                <span>Positive</span>
                <div className="bar positive" style={{width: '70%'}}></div>
              </div>
              <div className="sentiment-bar">
                <span>Neutral</span>
                <div className="bar neutral" style={{width: '20%'}}></div>
              </div>
              <div className="sentiment-bar">
                <span>Negative</span>
                <div className="bar negative" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="participants-tab">
          <div className="participants-table">
            <div className="table-header">
              <div className="table-cell">Participant</div>
              <div className="table-cell">Attention</div>
              <div className="table-cell">Participation</div>
              <div className="table-cell">Sentiment</div>
            </div>
            
            {engagementData.participants.map(participant => (
              <div key={participant.id} className="table-row">
                <div className="table-cell participant-info">
                  <div className="participant-avatar">
                    {participant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="participant-name">{participant.name}</div>
                    {participant.role === 'host' && (
                      <span className="host-badge">Host</span>
                    )}
                  </div>
                </div>
                <div className="table-cell">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${participant.attention}%`}}
                    ></div>
                  </div>
                  <span className="percentage">{participant.attention}%</span>
                </div>
                <div className="table-cell">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${participant.participation}%`}}
                    ></div>
                  </div>
                  <span className="percentage">{participant.participation}%</span>
                </div>
                <div className="table-cell">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${participant.sentiment}%`}}
                    ></div>
                  </div>
                  <span className="percentage">{participant.sentiment}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="timeline-tab">
          <div className="chart-container">
            <h3>Engagement Over Time</h3>
            <div className="timeline-chart">
              {engagementData.timeline.map((point, index) => (
                <div key={index} className="chart-point">
                  <div className="point-values">
                    <div className="attention-point" style={{height: `${point.attention}%`}}></div>
                    <div className="participation-point" style={{height: `${point.participation}%`}}></div>
                  </div>
                  <div className="point-time">{point.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementAnalytics;