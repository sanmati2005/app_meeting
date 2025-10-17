import sentimentService from '../services/sentimentService.js';
import voiceService from '../services/voiceService.js';
import translationService from '../services/translationService.js';
import Meeting from '../models/Meeting.js';

// Analyze text sentiment
const analyzeTextSentiment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const result = await sentimentService.analyzeTextSentiment(text);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to analyze sentiment',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      sentiment: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get meeting sentiment
const getMeetingSentiment = async (req, res) => {
  try {
    const { meetingId } = req.params;

    // Check if user has access to meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const result = await sentimentService.getMeetingSentiment(meetingId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get meeting sentiment',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      sentiment: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Generate sentiment report
const generateSentimentReport = async (req, res) => {
  try {
    const { meetingId } = req.params;

    // Check if user has access to meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const result = await sentimentService.generateSentimentReport(meetingId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate sentiment report',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      report: result.report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create voice profile
const createVoiceProfile = async (req, res) => {
  try {
    const { audioBuffer, profileName } = req.body;
    const userId = req.user.id;

    if (!profileName) {
      return res.status(400).json({
        success: false,
        message: 'Profile name is required'
      });
    }

    const result = await voiceService.createVoiceProfile(userId, audioBuffer, profileName);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create voice profile',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      voiceProfile: result.voiceProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// List voice profiles
const listVoiceProfiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await voiceService.listVoiceProfiles(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to list voice profiles',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      profiles: result.profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Convert text to speech
const textToSpeech = async (req, res) => {
  try {
    const { text, voiceProfileId } = req.body;

    if (!text || !voiceProfileId) {
      return res.status(400).json({
        success: false,
        message: 'Text and voice profile ID are required'
      });
    }

    const result = await voiceService.textToSpeech(text, voiceProfileId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate speech',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      audioPath: result.audioPath,
      duration: result.duration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Translate text
const translateText = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Text, source language, and target language are required'
      });
    }

    const result = await translationService.translateText(text, sourceLanguage, targetLanguage);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to translate text',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      translation: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get supported languages
const getSupportedLanguages = async (req, res) => {
  try {
    const result = translationService.getSupportedLanguages();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get supported languages',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      languages: result.languages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Real-time meeting translation
const translateMeeting = async (req, res) => {
  try {
    const { transcriptSegments, targetLanguage } = req.body;
    const { meetingId } = req.params;

    if (!transcriptSegments || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Transcript segments and target language are required'
      });
    }

    // Check if user has access to meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const result = await translationService.translateMeeting(transcriptSegments, targetLanguage);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to translate meeting',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      translation: result
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
  analyzeTextSentiment,
  getMeetingSentiment,
  generateSentimentReport,
  createVoiceProfile,
  listVoiceProfiles,
  textToSpeech,
  translateText,
  getSupportedLanguages,
  translateMeeting
};