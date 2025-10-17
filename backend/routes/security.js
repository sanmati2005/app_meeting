import express from 'express';
import { 
  enableEncryption,
  generatePasscode,
  validatePasscode,
  kickParticipant,
  banParticipant,
  lockMeeting,
  reportParticipant
} from '../controllers/securityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/encryption/:meetingId', protect, enableEncryption);
router.get('/passcode/:meetingId', protect, generatePasscode);
router.post('/passcode/:meetingId/validate', protect, validatePasscode);

router.delete('/participant/:meetingId/:participantId', protect, kickParticipant);
router.post('/participant/:meetingId/:participantId/ban', protect, banParticipant);

router.post('/meeting/:meetingId/lock', protect, lockMeeting);
router.post('/participant/:meetingId/:participantId/report', protect, reportParticipant);

export default router;