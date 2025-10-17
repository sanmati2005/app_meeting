import React, { useState, useEffect } from 'react';
import './SentimentAnalysis.css';

const SentimentAnalysis = () => {
  const [meetingSentiment, setMeetingSentiment] = useState(null);
  const [participantSentiments, setParticipantSentiments] = useState([]);
  const [keyMoments, setKeyMoments] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockSentimentData = {
      overallSentiment: {
        positive: 65,
        neutral: 25,
        negative: 10
      },
      participantSentiments: [
        { participant: 'John Smith', sentiment: 'positive', score: 0.85 },
        { participant: 'Sarah Johnson', sentiment: 'neutral', score: 0.65 },
        { participant: 'Michael Chen', sentiment: 'positive', score: 0.78 },
        { participant: 'Emma Wilson', sentiment: 'negative', score: 0.42 }
      ],
      keyMoments: [
        { time: '10:15', sentiment: 'positive', description: 'Discussion of Q3 results' },
        { time: '10:32', sentiment: 'negative', description: 'Budget concerns raised' },
        { time: '10:45', sentiment: 'positive', description: 'Solution proposed' },
        { time: '11:05', sentiment: 'positive', description: 'Action items assigned' }
      ]
    };

    setMeetingSentiment(mockSentimentData.overallSentiment);
    setParticipantSentiments(mockSentimentData.participantSentiments);
    setKeyMoments(mockSentimentData.keyMoments);
  }, []);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#38ef7d';
      case 'negative': return '#ff6b6b';
      case 'neutral': return '#f7971e';
      default: return '#cccccc';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  return (
    <div className="sentiment-container">
      <div className="sentiment-header">
        <h2>😊 Sentiment Analysis</h2>
        <p>Real-time emotional and sentiment analysis of voice and chat</p>
      </div>

      {meetingSentiment && (
        <div className="sentiment-overview">
          <h3>Meeting Sentiment Distribution</h3>
          <div className="sentiment-bars">
            <div className="sentiment-bar">
              <div className="bar-label">
                <span>Positive</span>
                <span>{meetingSentiment.positive}%</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar positive" 
                  style={{ width: `${meetingSentiment.positive}%` }}
                ></div>
              </div>
            </div>
            
            <div className="sentiment-bar">
              <div className="bar-label">
                <span>Neutral</span>
                <span>{meetingSentiment.neutral}%</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar neutral" 
                  style={{ width: `${meetingSentiment.neutral}%` }}
                ></div>
              </div>
            </div>
            
            <div className="sentiment-bar">
              <div className="bar-label">
                <span>Negative</span>
                <span>{meetingSentiment.negative}%</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar negative" 
                  style={{ width: `${meetingSentiment.negative}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sentiment-details">
        <div className="participants-sentiment">
          <h3>Participant Sentiment</h3>
          <div className="participants-grid">
            {participantSentiments.map((participant, index) => (
              <div key={index} className="participant-card">
                <div className="participant-header">
                  <div className="participant-avatar">
                    {participant.participant.charAt(0)}
                  </div>
                  <div className="participant-info">
                    <div className="participant-name">{participant.participant}</div>
                    <div className="sentiment-score">
                      <span className="sentiment-icon">{getSentimentIcon(participant.sentiment)}</span>
                      <span className="sentiment-value" style={{ color: getSentimentColor(participant.sentiment) }}>
                        {(participant.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="sentiment-indicator">
                  <div 
                    className="sentiment-level" 
                    style={{ 
                      width: `${participant.score * 100}%`,
                      backgroundColor: getSentimentColor(participant.sentiment)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="key-moments">
          <h3>Key Emotional Moments</h3>
          <div className="moments-list">
            {keyMoments.map((moment, index) => (
              <div key={index} className="moment-item">
                <div className="moment-time">{moment.time}</div>
                <div className="moment-content">
                  <div className="moment-sentiment">
                    <span className="sentiment-icon">{getSentimentIcon(moment.sentiment)}</span>
                    <span className="sentiment-text" style={{ color: getSentimentColor(moment.sentiment) }}>
                      {moment.sentiment}
                    </span>
                  </div>
                  <div className="moment-description">{moment.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sentiment-actions">
        <button className="action-btn generate-report">
          📊 Generate Detailed Report
        </button>
        <button className="action-btn export-data">
          📤 Export Sentiment Data
        </button>
      </div>
    </div>
  );
};

export default SentimentAnalysis;