import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isLogin) {
        // Login
        console.log('Attempting login with:', { email: formData.email, password: formData.password });
        const response = await api.login({
          email: formData.email,
          password: formData.password
        });
        
        console.log('Login response:', response);
        
        if (response.success) {
          // Use AuthContext login function to update app state
          login(response.token, response.user);
          
          // Redirect to meetings page
          navigate('/meetings');
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        // Register
        console.log('Attempting registration with:', { name: formData.name, email: formData.email, password: formData.password });
        const response = await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        console.log('Registration response:', response);
        
        if (response.success) {
          // Use AuthContext login function to update app state
          login(response.token, response.user);
          
          // Redirect to meetings page
          navigate('/meetings');
        } else {
          setError(response.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setError('');
    try {
      setLoading(true);
      // In a real app, this would redirect to Google OAuth
      // For now, we'll show an alert
      alert('Google login would redirect to Google OAuth in a production environment');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    setError('');
    try {
      setLoading(true);
      // In a real app, this would redirect to Microsoft OAuth
      // For now, we'll show an alert
      alert('Microsoft login would redirect to Microsoft OAuth in a production environment');
    } catch (err) {
      console.error('Microsoft login error:', err);
      setError('Microsoft login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="toggle-btn" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        
        <div className="oauth-section">
          <p className="divider">Or continue with</p>
          <div className="oauth-buttons">
            <button className="oauth-btn google" onClick={handleGoogleLogin} disabled={loading}>
              <span className="oauth-icon">G</span>
              Google
            </button>
            <button className="oauth-btn microsoft" onClick={handleMicrosoftLogin} disabled={loading}>
              <span className="oauth-icon">M</span>
              Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;