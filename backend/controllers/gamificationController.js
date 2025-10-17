import gamificationService from '../services/gamificationService.js';
import Meeting from '../models/Meeting.js';

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's meetings
    const meetings = await Meeting.find({
      $or: [
        { host: userId },
        { 'participants.user': userId }
      ]
    });

    // Calculate total meetings attended
    const totalMeetings = meetings.filter(meeting => 
      meeting.participants.some(p => 
        p.user && p.user.toString() === userId.toString() && p.status === 'joined'
      )
    ).length;

    // Calculate total hours in meetings (mock calculation)
    const totalHours = Math.floor(totalMeetings * 1.5); // Assume 1.5 hours per meeting

    // Calculate participation score
    const scoreResult = await gamificationService.calculateParticipationScore(userId);
    
    if (!scoreResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to calculate participation score',
        error: scoreResult.error
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalMeetings,
        totalHours,
        participationScore: scoreResult.score
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user badges
const getUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await gamificationService.getUserBadges(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get user badges',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      badges: result.badges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get weekly challenges
const getWeeklyChallenges = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await gamificationService.getWeeklyChallenges(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get weekly challenges',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      challenges: result.challenges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get team leaderboard
const getTeamLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real implementation, this would get the user's team members
    // For demo, we'll use mock team members
    const teamMembers = [
      { id: userId, name: 'You' },
      { id: 'user2', name: 'John Smith' },
      { id: 'user3', name: 'Sarah Johnson' },
      { id: 'user4', name: 'Michael Chen' },
      { id: 'user5', name: 'Emma Wilson' },
      { id: 'user6', name: 'David Brown' }
    ];

    const result = await gamificationService.getTeamLeaderboard(teamMembers);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get team leaderboard',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      leaderboard: result.leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Complete challenge
const completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const userId = req.user.id;

    // In a real implementation, this would mark the challenge as completed
    // and award points to the user
    
    // For demo, we'll simulate completing a challenge
    const challenges = [
      { id: 'weekly_meetings', title: 'Attend 5 meetings this week', reward: 50 },
      { id: 'weekly_speaking', title: 'Speak in 3 different meetings', reward: 30 },
      { id: 'host_meeting', title: 'Host a meeting', reward: 100 },
      { id: 'share_resource', title: 'Share a resource', reward: 25 }
    ];

    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Award points
    const awardResult = await gamificationService.awardPoints(
      userId, 
      challenge.reward, 
      challenge.title
    );

    if (!awardResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to award points',
        error: awardResult.error
      });
    }

    // Check for new badges
    const badgeResult = await gamificationService.checkAndAwardBadges(userId);

    res.status(200).json({
      success: true,
      message: `Challenge completed! ${awardResult.message}`,
      badge: badgeResult.badge
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
  getUserStats,
  getUserBadges,
  getWeeklyChallenges,
  getTeamLeaderboard,
  completeChallenge
};