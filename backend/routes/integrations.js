import express from 'express';
import { 
  connectGoogleDrive,
  connectMicrosoftTeams,
  connectSlack,
  googleDriveUpload,
  teamsSendMessage,
  slackSendMessage,
  getConnectedIntegrations
} from '../controllers/integrationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/google-drive/connect', protect, connectGoogleDrive);
router.post('/microsoft-teams/connect', protect, connectMicrosoftTeams);
router.post('/slack/connect', protect, connectSlack);

router.post('/google-drive/upload', protect, googleDriveUpload);
router.post('/teams/send-message', protect, teamsSendMessage);
router.post('/slack/send-message', protect, slackSendMessage);

router.get('/connected', protect, getConnectedIntegrations);

export default router;