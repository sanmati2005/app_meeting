import express from 'express';
import { register, login, googleLogin, microsoftLogin, getMe, updatePreferences } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/microsoft', microsoftLogin);
router.get('/me', protect, getMe);
router.put('/me', protect, updatePreferences); // Add this route for updating user profile
router.put('/preferences', protect, updatePreferences);

export default router;