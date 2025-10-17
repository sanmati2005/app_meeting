import express from 'express';
import { 
  analyzeTextSentiment,
  getMeetingSentiment,
  generateSentimentReport,
  createVoiceProfile,
  listVoiceProfiles,
  textToSpeech,
  translateText,
  getSupportedLanguages,
  translateMeeting
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Sentiment analysis routes
router.post('/sentiment/text', protect, analyzeTextSentiment);
router.get('/sentiment/meeting/:meetingId', protect, getMeetingSentiment);
router.get('/sentiment/report/:meetingId', protect, generateSentimentReport);

// Voice services routes
router.post('/voice/profile', protect, createVoiceProfile);
router.get('/voice/profiles', protect, listVoiceProfiles);
router.post('/voice/tts', protect, textToSpeech);

// Translation routes
router.post('/translate/text', protect, translateText);
router.get('/translate/languages', protect, getSupportedLanguages);
router.post('/translate/meeting/:meetingId', protect, translateMeeting);

export default router;