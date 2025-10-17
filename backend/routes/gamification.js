import express from 'express';
import { 
  getUserStats,
  getUserBadges,
  getWeeklyChallenges,
  getTeamLeaderboard,
  completeChallenge
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getUserStats);
router.get('/badges', protect, getUserBadges);
router.get('/challenges', protect, getWeeklyChallenges);
router.get('/leaderboard', protect, getTeamLeaderboard);
router.post('/complete-challenge', protect, completeChallenge);

export default router;