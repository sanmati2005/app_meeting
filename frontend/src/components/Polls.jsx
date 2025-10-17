import React, { useState } from 'react';
import './Polls.css';

const Polls = () => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: 'Which feature should we prioritize for the next release?',
      options: [
        { id: 1, text: 'AI-powered transcription', votes: 12 },
        { id: 2, text: 'Virtual backgrounds', votes: 8 },
        { id: 3, text: 'Breakout rooms', votes: 15 },
        { id: 4, text: 'Live polls', votes: 5 }
      ],
      totalVotes: 40,
      isActive: true,
      createdBy: 'John Smith'
    },
    {
      id: 2,
      question: 'How would you rate today\'s presentation?',
      options: [
        { id: 1, text: 'Excellent', votes: 18 },
        { id: 2, text: 'Good', votes: 12 },
        { id: 3, text: 'Average', votes: 4 },
        { id: 4, text: 'Poor', votes: 1 }
      ],
      totalVotes: 35,
      isActive: false,
      createdBy: 'Sarah Johnson'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  const [votes, setVotes] = useState({});

  const vote = (pollId, optionId) => {
    setVotes(prev => ({
      ...prev,
      [pollId]: optionId
    }));

    // Update poll results (in a real app, this would be sent to the server)
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map(option => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });
        return { ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 };
      }
      return poll;
    }));
  };

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index, value) => {
    setNewPoll(prev => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const createPoll = () => {
    if (newPoll.question.trim() && newPoll.options.filter(opt => opt.trim()).length >= 2) {
      const poll = {
        id: Date.now(),
        question: newPoll.question,
        options: newPoll.options
          .filter(opt => opt.trim())
          .map((opt, index) => ({ id: index + 1, text: opt, votes: 0 })),
        totalVotes: 0,
        isActive: true,
        createdBy: 'You'
      };
      setPolls([poll, ...polls]);
      setNewPoll({ question: '', options: ['', ''] });
      setShowCreateForm(false);
    }
  };

  const closePoll = (pollId) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, isActive: false } : poll
    ));
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="polls-container">
      <div className="polls-header">
        <h2>📊 Live Polls</h2>
        <p>Engage participants with interactive polls and surveys</p>
      </div>

      <div className="polls-controls">
        <button 
          className="create-poll-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Poll'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-poll-form">
          <h3>Create New Poll</h3>
          <div className="form-group">
            <label>Poll Question</label>
            <input
              type="text"
              placeholder="What would you like to ask?"
              value={newPoll.question}
              onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
              className="poll-input"
            />
          </div>
          
          <div className="form-group">
            <label>Options</label>
            {newPoll.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="poll-input option-input"
              />
            ))}
            <button className="add-option-btn" onClick={addOption}>
              + Add Option
            </button>
          </div>
          
          <button className="submit-poll-btn" onClick={createPoll}>
            Create Poll
          </button>
        </div>
      )}

      <div className="polls-list">
        {polls.map(poll => (
          <div key={poll.id} className="poll-card">
            <div className="poll-header">
              <div className="poll-info">
                <h3>{poll.question}</h3>
                <p>Created by {poll.createdBy} • {poll.totalVotes} votes</p>
              </div>
              {poll.isActive && (
                <button 
                  className="close-poll-btn"
                  onClick={() => closePoll(poll.id)}
                >
                  Close Poll
                </button>
              )}
            </div>
            
            <div className="poll-options">
              {poll.options.map(option => {
                const percentage = calculatePercentage(option.votes, poll.totalVotes);
                const isVoted = votes[poll.id] === option.id;
                
                return (
                  <div 
                    key={option.id} 
                    className={`poll-option ${isVoted ? 'voted' : ''} ${poll.isActive ? 'active' : ''}`}
                    onClick={() => poll.isActive && vote(poll.id, option.id)}
                  >
                    <div className="option-text">{option.text}</div>
                    <div className="option-bar">
                      <div 
                        className="bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <div className="option-stats">
                        <span className="percentage">{percentage}%</span>
                        <span className="votes">{option.votes} votes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {!poll.isActive && (
              <div className="poll-status">
                <span className="closed-badge">Poll Closed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polls;