import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, userId: 1, userName: 'John Smith', text: 'Hello everyone! Ready to start the meeting?', time: '10:30 AM', isHost: true },
    { id: 2, userId: 2, userName: 'Sarah Johnson', text: 'Yes, I\'ve prepared the presentation slides', time: '10:31 AM', isHost: false },
    { id: 3, userId: 3, userName: 'Michael Chen', text: 'Great! I\'ve reviewed the Q3 reports', time: '10:32 AM', isHost: false },
    { id: 4, userId: 1, userName: 'John Smith', text: 'Perfect. Let\'s begin in 5 minutes', time: '10:33 AM', isHost: true }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '👍', '👏', '🔥', '🎉', '💡', '✅', '❤️'];

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        userId: 4, // Current user
        userName: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isHost: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Meeting Chat</h3>
        <div className="chat-actions">
          <button className="action-btn">📎</button>
          <button className="action-btn">⚙️</button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.userId === 4 ? 'own-message' : ''}`}
          >
            <div className="message-avatar">
              {message.userName.charAt(0)}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-user">
                  {message.userName}
                  {message.isHost && <span className="host-badge">Host</span>}
                </span>
                <span className="message-time">{message.time}</span>
              </div>
              <div className="message-text">{message.text}</div>
              <div className="message-reactions">
                <button className="reaction-btn">👍 2</button>
                <button className="reaction-btn">❤️ 1</button>
                <button className="add-reaction-btn">+</button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showEmojiPicker && (
        <div className="emoji-picker">
          {emojis.map(emoji => (
            <button 
              key={emoji} 
              className="emoji-btn"
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-container">
        <div className="input-actions">
          <button 
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
          <button className="attach-btn">📎</button>
        </div>
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="chat-input"
            rows="1"
          />
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;