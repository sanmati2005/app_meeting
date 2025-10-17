import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;