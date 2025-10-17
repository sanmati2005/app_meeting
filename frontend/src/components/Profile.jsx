import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        push: true
      },
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      },
      video: {
        backgroundBlur: false,
        virtualBackground: ''
      }
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await api.getProfile();
        if (response.success) {
          const userProfile = response.user;
          setFormData({
            name: userProfile.name || '',
            email: userProfile.email || '',
            preferences: userProfile.preferences || {
              theme: 'dark',
              notifications: {
                email: true,
                push: true
              },
              audio: {
                noiseSuppression: true,
                echoCancellation: true
              },
              video: {
                backgroundBlur: false,
                virtualBackground: ''
              }
            }
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      const subKey = name.split('.')[2];
      
      if (subKey) {
        setFormData({
          ...formData,
          preferences: {
            ...formData.preferences,
            [prefKey]: {
              ...formData.preferences[prefKey],
              [subKey]: type === 'checkbox' ? checked : value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          preferences: {
            ...formData.preferences,
            [prefKey]: type === 'checkbox' ? checked : value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Update profile via API
      const response = await api.updateProfile({
        name: formData.name,
        email: formData.email,
        preferences: formData.preferences
      });
      
      if (response.success) {
        // Update auth context with new user data
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          preferences: formData.preferences
        };
        
        login(localStorage.getItem('token'), updatedUser);
        setSuccess('Profile updated successfully!');
        setEditing(false);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <h2>{user.name}</h2>
          <p className="user-email">{user.email}</p>
          <p className="user-role">Role: {user.role || 'user'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          {editing ? (
            <>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Preferences</h3>
                
                <div className="form-group">
                  <label htmlFor="preferences.theme">Theme</label>
                  <select
                    id="preferences.theme"
                    name="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.notifications.email"
                      checked={formData.preferences.notifications.email}
                      onChange={handleChange}
                    />
                    Email Notifications
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.notifications.push"
                      checked={formData.preferences.notifications.push}
                      onChange={handleChange}
                    />
                    Push Notifications
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.audio.noiseSuppression"
                      checked={formData.preferences.audio.noiseSuppression}
                      onChange={handleChange}
                    />
                    Noise Suppression
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.audio.echoCancellation"
                      checked={formData.preferences.audio.echoCancellation}
                      onChange={handleChange}
                    />
                    Echo Cancellation
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.video.backgroundBlur"
                      checked={formData.preferences.video.backgroundBlur}
                      onChange={handleChange}
                    />
                    Background Blur
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      preferences: user.preferences || {
                        theme: 'dark',
                        notifications: {
                          email: true,
                          push: true
                        },
                        audio: {
                          noiseSuppression: true,
                          echoCancellation: true
                        },
                        video: {
                          backgroundBlur: false,
                          virtualBackground: ''
                        }
                      }
                    });
                    setError('');
                    setSuccess('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-details">
                <div className="detail-group">
                  <h3>Personal Information</h3>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
                
                <div className="detail-group">
                  <h3>Preferences</h3>
                  <p><strong>Theme:</strong> {user.preferences?.theme || 'dark'}</p>
                  <p><strong>Email Notifications:</strong> {user.preferences?.notifications?.email ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Push Notifications:</strong> {user.preferences?.notifications?.push ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Noise Suppression:</strong> {user.preferences?.audio?.noiseSuppression ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Echo Cancellation:</strong> {user.preferences?.audio?.echoCancellation ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Background Blur:</strong> {user.preferences?.video?.backgroundBlur ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              
              <div className="profile-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;