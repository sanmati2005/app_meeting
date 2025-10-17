import React, { useState, useEffect } from 'react';
import './VoiceAssistant.css';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceProfiles, setVoiceProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [assistantMessages, setAssistantMessages] = useState([
    { id: 1, text: "Hello! I'm your AI meeting assistant. How can I help you?", type: 'assistant' }
  ]);

  // Mock voice profiles
  useEffect(() => {
    const mockProfiles = [
      { id: 1, name: 'Professional Voice', tone: 'warm' },
      { id: 2, name: 'Friendly Voice', tone: 'bright' },
      { id: 3, name: 'Calm Voice', tone: 'cool' }
    ];
    setVoiceProfiles(mockProfiles);
    setSelectedProfile(mockProfiles[0]);
  }, []);

  const startListening = () => {
    setIsListening(true);
    // In a real app, this would start speech recognition
    setTimeout(() => {
      setTranscript("Can you summarize the key points from today's meeting?");
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speakText = (text) => {
    setIsSpeaking(true);
    setAssistantMessages(prev => [
      ...prev,
      { id: prev.length + 1, text, type: 'assistant' }
    ]);
    
    // In a real app, this would use text-to-speech
    setTimeout(() => {
      setIsSpeaking(false);
    }, 5000);
  };

  const handleVoiceCommand = () => {
    if (transcript) {
      // Add user message
      setAssistantMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: transcript, type: 'user' }
      ]);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "I've summarized the key points and sent them to all participants.",
          "I've created action items for the team and set due dates.",
          "I've noted that budget concerns were raised and will follow up.",
          "I've recorded this discussion for future reference."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        speakText(response);
      }, 1000);
      
      setTranscript('');
    }
  };

  const addReminder = () => {
    const reminder = "Remember to follow up on the budget proposal by Friday";
    setAssistantMessages(prev => [
      ...prev,
      { id: prev.length + 1, text: reminder, type: 'reminder' }
    ]);
    speakText("I've set a reminder for you: " + reminder);
  };

  const suggestAction = () => {
    const suggestions = [
      "Consider asking for feedback on the Q3 presentation",
      "You might want to schedule a follow-up meeting with the client",
      "Don't forget to update the project timeline",
      "It would be helpful to assign someone to research the new market"
    ];
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setAssistantMessages(prev => [
      ...prev,
      { id: prev.length + 1, text: suggestion, type: 'suggestion' }
    ]);
    speakText("Here's a suggestion: " + suggestion);
  };

  return (
    <div className="voice-assistant-container">
      <div className="assistant-header">
        <h2>🤖 AI Voice Assistant</h2>
        <p>Smart meeting assistant providing live suggestions and reminders</p>
      </div>

      <div className="assistant-main">
        <div className="voice-controls">
          <div className="voice-profile-selector">
            <label>Voice Profile:</label>
            <select 
              value={selectedProfile?.id || ''}
              onChange={(e) => {
                const profile = voiceProfiles.find(p => p.id === parseInt(e.target.value));
                setSelectedProfile(profile);
              }}
              className="profile-select"
            >
              {voiceProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="microphone-control">
            {!isListening ? (
              <button 
                className="mic-btn start"
                onClick={startListening}
              >
                <span className="mic-icon">🎤</span>
                <span className="btn-label">Start Listening</span>
              </button>
            ) : (
              <button 
                className="mic-btn stop"
                onClick={stopListening}
              >
                <span className="mic-icon">🛑</span>
                <span className="btn-label">Stop Listening</span>
              </button>
            )}
          </div>

          <div className="transcript-display">
            <div className="transcript-label">Voice Command:</div>
            <div className="transcript-text">
              {transcript || (isListening ? "Listening..." : "Press microphone to speak")}
            </div>
            {transcript && (
              <button 
                className="execute-btn"
                onClick={handleVoiceCommand}
              >
                Execute Command
              </button>
            )}
          </div>
        </div>

        <div className="assistant-chat">
          <div className="chat-messages">
            {assistantMessages.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'assistant' && <div className="avatar">🤖</div>}
                {message.type === 'user' && <div className="avatar">👤</div>}
                {message.type === 'reminder' && <div className="avatar">⏰</div>}
                {message.type === 'suggestion' && <div className="avatar">💡</div>}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <button className="action-btn" onClick={addReminder}>
              ⏰ Add Reminder
            </button>
            <button className="action-btn" onClick={suggestAction}>
              💡 Get Suggestion
            </button>
            <button className="action-btn">
              📝 Create Summary
            </button>
          </div>
        </div>
      </div>

      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="pulse-animation"></div>
          <div className="indicator-text">Assistant is speaking...</div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;