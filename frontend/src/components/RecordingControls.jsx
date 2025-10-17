import React, { useState } from 'react';
import './RecordingControls.css';

const RecordingControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState([]);

  // Timer for recording
  React.useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // In a real app, this would call the backend API to start recording
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, this would call the backend API to stop recording
    // and generate transcript, summary, and action items
    generateMockData();
  };

  const generateMockData = () => {
    // Mock transcript
    setTranscript(`
      John Smith: Good morning everyone. Let's start our weekly team meeting.
      Sarah Johnson: Good morning. I have the Q3 report ready to present.
      Michael Chen: Great. Can we review the sales figures first?
      John Smith: Yes, let's go through the numbers.
      Sarah Johnson: Q3 sales increased by 15% compared to Q2.
      Emma Wilson: That's excellent progress. What contributed to this growth?
      Sarah Johnson: The new marketing campaign and improved customer retention.
    `.trim());

    // Mock summary
    setSummary(`
      ## Team Meeting Summary
      
      **Key Points:**
      - Q3 sales increased by 15% compared to Q2
      - New marketing campaign contributed to growth
      - Customer retention improved significantly
      
      **Action Items:**
      - Sarah to prepare Q4 budget proposal by Friday
      - Michael to schedule client feedback sessions
      - Emma to update the project timeline
      
      **Next Steps:**
      - Follow-up meeting scheduled for next week
      - Product launch planned for December
    `.trim());

    // Mock action items
    setActionItems([
      { task: 'Prepare Q4 budget proposal', assignee: 'Sarah', dueDate: 'Friday' },
      { task: 'Schedule client feedback sessions', assignee: 'Michael', dueDate: 'Next week' },
      { task: 'Update project timeline', assignee: 'Emma', dueDate: 'Tomorrow' }
    ]);
  };

  return (
    <div className="recording-container">
      <div className="recording-header">
        <h3>📹 Recording & Transcription</h3>
      </div>

      <div className="recording-controls">
        {!isRecording ? (
          <button 
            className="record-btn start"
            onClick={startRecording}
          >
            <span className="btn-icon">🔴</span>
            <span className="btn-label">Start Recording</span>
          </button>
        ) : (
          <button 
            className="record-btn stop"
            onClick={stopRecording}
          >
            <span className="btn-icon">⏹️</span>
            <span className="btn-label">Stop Recording</span>
          </button>
        )}
        
        {isRecording && (
          <div className="recording-timer">
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {transcript && (
        <div className="transcript-section">
          <h4>Transcript</h4>
          <div className="transcript-content">
            <pre>{transcript}</pre>
          </div>
        </div>
      )}

      {summary && (
        <div className="summary-section">
          <h4>AI Meeting Summary</h4>
          <div className="summary-content">
            <pre>{summary}</pre>
          </div>
        </div>
      )}

      {actionItems.length > 0 && (
        <div className="action-items-section">
          <h4>AI Action Items</h4>
          <div className="action-items-list">
            {actionItems.map((item, index) => (
              <div key={index} className="action-item">
                <div className="item-task">{item.task}</div>
                <div className="item-details">
                  <span className="assignee">👤 {item.assignee}</span>
                  <span className="due-date">📅 {item.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;