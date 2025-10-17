import express from 'express';
import { 
  createMeeting, 
  getMeetings, 
  getMeeting, 
  updateMeeting, 
  deleteMeeting, 
  addParticipant,
  updateMeetingStatus,
  muteParticipant,
  removeParticipant,
  spotlightParticipant,
  toggleHandRaise,
  updateParticipantJoinTime,
  updateParticipantLeaveTime,
  getParticipantAnalytics
} from '../controllers/meetingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createMeeting)
  .get(protect, getMeetings);

router.route('/:id')
  .get(protect, getMeeting)
  .put(protect, updateMeeting)
  .delete(protect, deleteMeeting);

router.put('/:id/participant', protect, addParticipant);
router.put('/:id/status', protect, updateMeetingStatus);

// Participant management routes
router.put('/:id/participant/:participantId/mute', protect, muteParticipant);
router.delete('/:id/participant/:participantId', protect, removeParticipant);
router.put('/:id/participant/:participantId/spotlight', protect, spotlightParticipant);
router.put('/:id/participant/:participantId/hand', protect, toggleHandRaise);

// Participant time tracking routes
router.put('/:id/participant/:participantId/join-time', protect, updateParticipantJoinTime);
router.put('/:id/participant/:participantId/leave-time', protect, updateParticipantLeaveTime);

// Analytics route
router.get('/:id/analytics', protect, getParticipantAnalytics);

export default router;