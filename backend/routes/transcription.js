import express from 'express';
import { 
  startRecording, 
  stopRecording, 
  generateTranscript, 
  generateSummary, 
  generateActionItems 
} from '../controllers/transcriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start/:meetingId', protect, startRecording);
router.post('/stop/:meetingId', protect, stopRecording);
router.post('/transcript/:meetingId', protect, generateTranscript);
router.post('/summary/:meetingId', protect, generateSummary);
router.post('/action-items/:meetingId', protect, generateActionItems);

export default router;