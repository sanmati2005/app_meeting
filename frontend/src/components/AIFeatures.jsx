import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AIFeatures.css';

const AIFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('background');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [participantData, setParticipantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load analytics data when analytics feature is selected
  useEffect(() => {
    if (activeFeature === 'analytics' && !analyticsData) {
      loadAnalyticsData();
    }
  }, [activeFeature]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current meeting ID from localStorage or URL
      const meetingId = localStorage.getItem('currentMeetingId');
      if (meetingId) {
        // Fetch real participant analytics data
        const response = await api.fetch(`/api/meetings/${meetingId}/analytics`, {
          method: 'GET'
        });
        
        if (response.success) {
          setParticipantData(response.participantData);
          
          // Calculate overall analytics from participant data
          const totalParticipants = response.participantData.length;
          const totalDuration = response.participantData.reduce((sum, p) => sum + (p.duration || 0), 0);
          const avgDuration = totalParticipants > 0 ? Math.floor(totalDuration / totalParticipants) : 0;
          
          // Mock sentiment data for demonstration
          const sentiment = {
            positive: 70,
            neutral: 20,
            negative: 10
          };
          
          setAnalyticsData({
            engagementRate: Math.min(100, Math.floor((totalParticipants / 15) * 100)),
            avgAttention: Math.floor(avgDuration / 60),
            completion: 92,
            effectiveness: 4.2,
            sentiment,
            participants: totalParticipants,
            duration: formatDuration(totalDuration),
            topics: [
              { name: 'Q3 Marketing Strategy', relevance: 95 },
              { name: 'Budget Allocation', relevance: 88 },
              { name: 'Product Launch', relevance: 82 },
              { name: 'Client Feedback', relevance: 76 }
            ],
            actionItems: [
              { assignee: 'John', task: 'Prepare detailed budget breakdown', dueDate: 'Monday' },
              { assignee: 'Sarah', task: 'Schedule client presentation', dueDate: 'Next week' },
              { assignee: 'Mike', task: 'Update product roadmap', dueDate: 'Friday' }
            ]
          });
        } else {
          throw new Error(response.message || 'Failed to load analytics data');
        }
      } else {
        // Use mock data if no meeting ID
        const mockAnalyticsData = {
          engagementRate: 87,
          avgAttention: 24,
          completion: 92,
          effectiveness: 4.2,
          sentiment: {
            positive: 70,
            neutral: 20,
            negative: 10
          },
          participants: 12,
          duration: '42:15',
          topics: [
            { name: 'Q3 Marketing Strategy', relevance: 95 },
            { name: 'Budget Allocation', relevance: 88 },
            { name: 'Product Launch', relevance: 82 },
            { name: 'Client Feedback', relevance: 76 }
          ],
          actionItems: [
            { assignee: 'John', task: 'Prepare detailed budget breakdown', dueDate: 'Monday' },
            { assignee: 'Sarah', task: 'Schedule client presentation', dueDate: 'Next week' },
            { assignee: 'Mike', task: 'Update product roadmap', dueDate: 'Friday' }
          ]
        };
        setAnalyticsData(mockAnalyticsData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Analytics load error:', err);
      setError(err.message || 'Failed to load analytics data');
      setLoading(false);
    }
  };

  // Format duration in seconds to human-readable format
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

  const features = [
    {
      id: 'background',
      title: 'AI Virtual Backgrounds',
      description: 'Replace your background with AI-generated scenes or blur it for privacy',
      icon: '🖼️'
    },
    {
      id: 'transcription',
      title: 'Live Transcription',
      description: 'Real-time speech-to-text with speaker identification and translation',
      icon: '📝'
    },
    {
      id: 'analytics',
      title: 'Meeting Analytics',
      description: 'AI-powered insights on participant engagement and meeting effectiveness',
      icon: '📊'
    },
    {
      id: 'summary',
      title: 'AI Meeting Summary',
      description: 'Automatic generation of action items, key points, and next steps',
      icon: '🧠'
    }
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'background':
        return (
          <div className="feature-demo">
            <div className="background-demo">
              <div className="video-placeholder">
                <div className="person-outline"></div>
              </div>
              <div className="background-options">
                <div className="background-option active">
                  <div className="blur-bg"></div>
                  <span>Blur</span>
                </div>
                <div className="background-option">
                  <div className="office-bg"></div>
                  <span>Office</span>
                </div>
                <div className="background-option">
                  <div className="beach-bg"></div>
                  <span>Beach</span>
                </div>
                <div className="background-option">
                  <div className="custom-bg"></div>
                  <span>Custom</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'transcription':
        return (
          <div className="feature-demo">
            <div className="transcription-demo">
              <div className="transcript-line speaker-1">
                <span className="speaker">John:</span>
                <span className="text">Let&#39;s discuss the Q3 marketing strategy and budget allocation.</span>
              </div>
              <div className="transcript-line speaker-2">
                <span className="speaker">Sarah:</span>
                <span className="text">I&#39;ve prepared a presentation with three different approaches we can take.</span>
              </div>
              <div className="transcript-line speaker-3">
                <span className="speaker">Mike:</span>
                <span className="text">The digital campaign showed promising results in our pilot test last month.</span>
              </div>
              <div className="transcript-controls">
                <button>🎤 Record</button>
                <button>⏹️ Stop</button>
                <button>💾 Save</button>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="feature-demo">
            {loading ? (
              <div className="loading">Loading analytics data...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="analytics-demo">
                <div className="analytics-grid">
                  <div className="metric-card">
                    <h3>{analyticsData?.engagementRate || 0}%</h3>
                    <p>Engagement Rate</p>
                  </div>
                  <div className="metric-card">
                    <h3>{analyticsData?.avgAttention || 0} min</h3>
                    <p>Avg. Attention</p>
                  </div>
                  <div className="metric-card">
                    <h3>{analyticsData?.completion || 0}%</h3>
                    <p>Completion</p>
                  </div>
                  <div className="metric-card">
                    <h3>{analyticsData?.effectiveness || 0}/5</h3>
                    <p>Effectiveness</p>
                  </div>
                </div>
                <div className="sentiment-chart">
                  <div className="chart-header">
                    <h4>Meeting Sentiment Analysis</h4>
                  </div>
                  <div className="sentiment-bars">
                    <div className="sentiment-bar">
                      <span>Positive</span>
                      <div className="bar positive" style={{width: `${analyticsData?.sentiment?.positive || 0}%`}}></div>
                    </div>
                    <div className="sentiment-bar">
                      <span>Neutral</span>
                      <div className="bar neutral" style={{width: `${analyticsData?.sentiment?.neutral || 0}%`}}></div>
                    </div>
                    <div className="sentiment-bar">
                      <span>Negative</span>
                      <div className="bar negative" style={{width: `${analyticsData?.sentiment?.negative || 0}%`}}></div>
                    </div>
                  </div>
                </div>
                {participantData.length > 0 && (
                  <div className="participant-analytics">
                    <h4>Participant Engagement</h4>
                    <div className="participant-list">
                      {participantData.map((participant, index) => (
                        <div key={index} className="participant-item">
                          <span className="participant-name">{participant.name}</span>
                          <span className="participant-duration">{formatDuration(participant.duration)}</span>
                          <span className="participant-status">
                            {participant.isMuted ? '🔇 Muted' : '🎤 Unmuted'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'summary':
        return (
          <div className="feature-demo">
            <div className="summary-demo">
              <div className="summary-content">
                <h3>Meeting Summary</h3>
                <div className="summary-section">
                  <h4>Key Points</h4>
                  <ul>
                    <li>Q3 marketing budget approved: $250,000</li>
                    <li>New product launch scheduled for October 15th</li>
                    <li>Client feedback integration to be completed by Friday</li>
                  </ul>
                </div>
                <div className="summary-section">
                  <h4>Action Items</h4>
                  <ul>
                    <li>John: Prepare detailed budget breakdown by Monday</li>
                    <li>Sarah: Schedule client presentation for next week</li>
                    <li>Mike: Update product roadmap with new timeline</li>
                  </ul>
                </div>
                <div className="summary-section">
                  <h4>Next Steps</h4>
                  <p>Follow-up meeting scheduled for next Thursday at 2:00 PM to review progress on action items.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ai-features-container">
      <div className="features-header">
        <h2>AI-Powered Features</h2>
        <p>Enhance your meetings with cutting-edge artificial intelligence</p>
      </div>

      <div className="features-navigation">
        {features.map(feature => (
          <button
            key={feature.id}
            className={`feature-tab ${activeFeature === feature.id ? 'active' : ''}`}
            onClick={() => setActiveFeature(feature.id)}
          >
            <span className="feature-icon">{feature.icon}</span>
            <span className="feature-title">{feature.title}</span>
          </button>
        ))}
      </div>

      <div className="features-content">
        <div className="feature-description">
          <h3>{features.find(f => f.id === activeFeature)?.title}</h3>
          <p>{features.find(f => f.id === activeFeature)?.description}</p>
        </div>

        {renderFeatureContent()}
      </div>
    </div>
  );
};

export default AIFeatures;