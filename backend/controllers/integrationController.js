import integrationService from '../services/integrationService.js';
import User from '../models/User.js';

// Connect to Google Drive
const connectGoogleDrive = async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real implementation, this would exchange the authorization code
    // for an access token using Google's OAuth2 API
    
    // For demo purposes, we'll simulate a successful connection
    const user = await User.findById(userId);
    
    // Add Google Drive connection to user
    user.calendarConnections.push({
      type: 'google',
      accessToken: 'mock-google-access-token',
      refreshToken: 'mock-google-refresh-token',
      connected: true,
      connectedAt: Date.now()
    });
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Google Drive connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Connect to Microsoft Teams
const connectMicrosoftTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real implementation, this would exchange the authorization code
    // for an access token using Microsoft's OAuth2 API
    
    // For demo purposes, we'll simulate a successful connection
    const user = await User.findById(userId);
    
    // Add Microsoft Teams connection to user
    user.calendarConnections.push({
      type: 'microsoft',
      accessToken: 'mock-microsoft-access-token',
      refreshToken: 'mock-microsoft-refresh-token',
      connected: true,
      connectedAt: Date.now()
    });
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Microsoft Teams connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Connect to Slack
const connectSlack = async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real implementation, this would exchange the authorization code
    // for an access token using Slack's OAuth2 API
    
    // For demo purposes, we'll simulate a successful connection
    const user = await User.findById(userId);
    
    // Add Slack connection to user
    user.calendarConnections.push({
      type: 'slack',
      accessToken: 'mock-slack-access-token',
      refreshToken: 'mock-slack-refresh-token',
      connected: true,
      connectedAt: Date.now()
    });
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Slack connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Upload file to Google Drive
const googleDriveUpload = async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    const userId = req.user.id;

    // Get user's Google access token
    const user = await User.findById(userId);
    const googleConnection = user.calendarConnections.find(conn => conn.type === 'google');
    
    if (!googleConnection || !googleConnection.connected) {
      return res.status(400).json({
        success: false,
        message: 'Google Drive not connected'
      });
    }

    // Upload file
    const result = await integrationService.googleDriveUpload(
      googleConnection.accessToken,
      fileData,
      fileName
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to Google Drive',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      file: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Send message to Teams channel
const teamsSendMessage = async (req, res) => {
  try {
    const { teamId, channelId, message } = req.body;
    const userId = req.user.id;

    // Get user's Microsoft access token
    const user = await User.findById(userId);
    const microsoftConnection = user.calendarConnections.find(conn => conn.type === 'microsoft');
    
    if (!microsoftConnection || !microsoftConnection.connected) {
      return res.status(400).json({
        success: false,
        message: 'Microsoft Teams not connected'
      });
    }

    // Send message
    const result = await integrationService.teamsSendMessage(
      microsoftConnection.accessToken,
      teamId,
      channelId,
      message
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send message to Teams',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Send message to Slack channel
const slackSendMessage = async (req, res) => {
  try {
    const { channelId, message } = req.body;
    const userId = req.user.id;

    // Get user's Slack access token
    const user = await User.findById(userId);
    const slackConnection = user.calendarConnections.find(conn => conn.type === 'slack');
    
    if (!slackConnection || !slackConnection.connected) {
      return res.status(400).json({
        success: false,
        message: 'Slack not connected'
      });
    }

    // Send message
    const result = await integrationService.slackSendMessage(
      slackConnection.accessToken,
      channelId,
      message
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send message to Slack',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get connected integrations
const getConnectedIntegrations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's connections
    const user = await User.findById(userId);
    
    const connectedIntegrations = user.calendarConnections
      .filter(conn => conn.connected)
      .map(conn => conn.type);

    res.status(200).json({
      success: true,
      integrations: connectedIntegrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export {
  connectGoogleDrive,
  connectMicrosoftTeams,
  connectSlack,
  googleDriveUpload,
  teamsSendMessage,
  slackSendMessage,
  getConnectedIntegrations
};