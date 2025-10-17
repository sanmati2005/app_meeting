import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine active view based on current location
  const getActiveView = () => {
    switch (location.pathname) {
      case '/':
      case '/meetings':
        return 'meetings';
      case '/analytics':
        return 'analytics';
      case '/settings':
        return 'settings';
      case '/profile':
        return 'profile';
      default:
        return 'meetings';
    }
  };

  const activeView = getActiveView();

  if (!user) {
    return (
      <nav className="navigation">
        <div className="nav-brand">
          <h2>AI Meeting</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>AI Meeting</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/meetings"
            className={activeView === 'meetings' ? 'active' : ''}
          >
            📅 Meetings
          </Link>
        </li>
        <li>
          <Link 
            to="/"
            className={activeView === 'meetings' ? 'active' : ''}
          >
            🎥 Room
          </Link>
        </li>
        <li>
          <Link 
            to="/analytics"
            className={activeView === 'analytics' ? 'active' : ''}
          >
            📊 Analytics
          </Link>
        </li>
        <li>
          <Link 
            to="/settings"
            className={activeView === 'settings' ? 'active' : ''}
          >
            ⚙️ Settings
          </Link>
        </li>
        <li>
          <Link 
            to="/profile"
            className={activeView === 'profile' ? 'active' : ''}
          >
            👤 Profile
          </Link>
        </li>
        <li>
          <Link to="/camera-test" className="nav-link">
            📷 Camera Test
          </Link>
        </li>
        <li>
          <Link to="/test" className="nav-link">
            🧪 Test
          </Link>
        </li>
        <li>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            🔒 Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;