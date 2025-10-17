import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import VideoCall from './components/VideoCall';
import MeetingRoom from './components/MeetingRoom';
import AIFeatures from './components/AIFeatures';
import Settings from './components/Settings';
import Login from './components/Login';
import Profile from './components/Profile';
import CameraTest from './components/CameraTest';
import TestComponent from './components/TestComponent';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user && (
        <>
          <ThemeToggle />
          <Navigation />
        </>
      )}
      
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          } />
          <Route path="/room/:roomId" element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          } />
          <Route path="/meetings" element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AIFeatures />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/camera-test" element={
            <ProtectedRoute>
              <CameraTest />
            </ProtectedRoute>
          } />
          <Route path="/test" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;