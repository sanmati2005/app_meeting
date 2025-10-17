import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'meeting', title: 'Team Standup', message: 'Meeting starts in 5 minutes', time: '10:25 AM', read: false },
    { id: 2, type: 'chat', title: 'New Message', message: 'Sarah: Can you share the presentation?', time: '10:15 AM', read: true },
    { id: 3, type: 'participant', title: 'Participant Joined', message: 'Michael Chen joined the meeting', time: '10:05 AM', read: true },
    { id: 4, type: 'recording', title: 'Recording Started', message: 'Your meeting is now being recorded', time: '9:55 AM', read: true }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Simulate receiving a new notification
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification = {
          id: Date.now(),
          type: ['meeting', 'chat', 'participant'][Math.floor(Math.random() * 3)],
          title: 'New Notification',
          message: 'This is a simulated notification',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'meeting': return '📅';
      case 'chat': return '💬';
      case 'participant': return '👤';
      case 'recording': return '🔴';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-container">
      <button 
        className="notifications-toggle"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            <div className="panel-actions">
              <button onClick={markAllAsRead}>Mark all as read</button>
              <button onClick={clearAll}>Clear all</button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;