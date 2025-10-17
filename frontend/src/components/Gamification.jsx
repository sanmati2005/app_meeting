import React, { useState } from 'react';
import './Gamification.css';

const Gamification = () => {
  const [userStats] = useState({
    totalMeetings: 42,
    totalHours: 127,
    participationScore: 87,
    badges: [
      { id: 1, name: 'First Meeting', icon: '🎯', earned: true },
      { id: 2, name: 'Consistent Participant', icon: '📅', earned: true },
      { id: 3, name: 'Active Speaker', icon: '💬', earned: true },
      { id: 4, name: 'Meeting Host', icon: '👑', earned: true },
      { id: 5, name: 'Knowledge Sharer', icon: '📚', earned: false },
      { id: 6, name: 'Team Player', icon: '🤝', earned: false }
    ]
  });

  const [leaderboard] = useState([
    { id: 1, name: 'John Smith', score: 95, avatar: 'JS', position: 1 },
    { id: 2, name: 'Sarah Johnson', score: 88, avatar: 'SJ', position: 2 },
    { id: 3, name: 'Michael Chen', score: 82, avatar: 'MC', position: 3 },
    { id: 4, name: 'Emma Wilson', score: 79, avatar: 'EW', position: 4 },
    { id: 5, name: 'David Brown', score: 76, avatar: 'DB', position: 5 },
    { id: 6, name: 'You', score: 87, avatar: 'Y', position: 3, isCurrentUser: true }
  ]);

  const [challenges] = useState([
    { id: 1, title: 'Attend 5 meetings this week', progress: 3, target: 5, reward: 50, completed: false },
    { id: 2, title: 'Speak in 3 different meetings', progress: 2, target: 3, reward: 30, completed: false },
    { id: 3, title: 'Host a meeting', progress: 0, target: 1, reward: 100, completed: false },
    { id: 4, title: 'Share a resource', progress: 1, target: 1, reward: 25, completed: true }
  ]);

  const [showAchievements, setShowAchievements] = useState(false);



  const getProgressPercentage = (progress, target) => {
    return Math.min(100, (progress / target) * 100);
  };

  return (
    <div className="gamification-container">
      <div className="gamification-header">
        <h2>🏆 Gamification & Engagement</h2>
        <p>Earn points, badges, and climb the leaderboard</p>
      </div>

      <div className="gamification-stats">
        <div className="stats-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.totalMeetings}</div>
            <div className="stat-label">Meetings Attended</div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.totalHours}</div>
            <div className="stat-label">Hours in Meetings</div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.participationScore}</div>
            <div className="stat-label">Participation Score</div>
          </div>
        </div>
      </div>

      <div className="gamification-content">
        <div className="badges-section">
          <div className="section-header">
            <h3>Badges & Achievements</h3>
            <button 
              className="view-all-btn"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              {showAchievements ? 'Show Less' : 'View All'}
            </button>
          </div>

          <div className="badges-grid">
            {userStats.badges
              .filter(badge => showAchievements || badge.earned)
              .map(badge => (
                <div 
                  key={badge.id} 
                  className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
                >
                  <div 
                    className="badge-icon" 
                    style={{ opacity: badge.earned ? 1 : 0.5 }}
                  >
                    {badge.icon}
                  </div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-status">
                    {badge.earned ? 'Earned' : 'Locked'}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="challenges-section">
          <h3>Weekly Challenges</h3>
          <div className="challenges-list">
            {challenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-info">
                  <div className="challenge-title">{challenge.title}</div>
                  <div className="challenge-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercentage(challenge.progress, challenge.target)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {challenge.progress} / {challenge.target}
                    </div>
                  </div>
                </div>
                <div className="challenge-reward">
                  <div className="reward-points">+{challenge.reward} pts</div>
                  {challenge.completed && (
                    <div className="completed-badge">Completed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="leaderboard-section">
          <h3>Team Leaderboard</h3>
          <div className="leaderboard-list">
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .map((user, index) => (
                <div 
                  key={user.id} 
                  className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className="leaderboard-position">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="leaderboard-avatar">
                    {user.avatar}
                  </div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">{user.name}</div>
                    <div className="leaderboard-score">{user.score} pts</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;