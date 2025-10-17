import User from '../models/User.js';

class GamificationService {
  constructor() {
    this.badges = [
      { id: 'first_meeting', name: 'First Meeting', description: 'Attend your first meeting', points: 10 },
      { id: 'consistent_participant', name: 'Consistent Participant', description: 'Attend 10 meetings', points: 50 },
      { id: 'active_speaker', name: 'Active Speaker', description: 'Speak in 5 different meetings', points: 30 },
      { id: 'meeting_host', name: 'Meeting Host', description: 'Host your first meeting', points: 100 },
      { id: 'knowledge_sharer', name: 'Knowledge Sharer', description: 'Share 3 resources in meetings', points: 25 },
      { id: 'team_player', name: 'Team Player', description: 'Participate in 3 breakout rooms', points: 40 }
    ];

    this.challenges = [
      { id: 'weekly_meetings', title: 'Attend 5 meetings this week', target: 5, reward: 50 },
      { id: 'weekly_speaking', title: 'Speak in 3 different meetings', target: 3, reward: 30 },
      { id: 'host_meeting', title: 'Host a meeting', target: 1, reward: 100 },
      { id: 'share_resource', title: 'Share a resource', target: 1, reward: 25 }
    ];
  }

  // Calculate user participation score
  async calculateParticipationScore() {
    try {
      // Calculate score based on participation
      let score = 0;
      
      // Base points for attendance
      const attendedMeetingsCount = Math.floor(Math.random() * 20);
      score += attendedMeetingsCount * 5;

      // Bonus points for hosting
      const hostedMeetingsCount = Math.floor(Math.random() * 5);
      score += hostedMeetingsCount * 20;

      // Bonus points for active participation
      const activeParticipationsCount = Math.floor(Math.random() * 10);
      score += activeParticipationsCount * 15;

      return {
        success: true,
        score: Math.min(100, score) // Cap at 100
      };
    } catch (error) {
      console.error('Error calculating participation score:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user badges
  async getUserBadges(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // In a real implementation, this would check user's actual achievements
      // For demo, we'll return mock badges
      const earnedBadges = this.badges.map(badge => ({
        ...badge,
        earned: Math.random() > 0.3 // 70% chance of earning each badge
      }));

      return {
        success: true,
        badges: earnedBadges
      };
    } catch (error) {
      console.error('Error getting user badges:', error);
      return { success: false, error: error.message };
    }
  }

  // Get weekly challenges
  async getWeeklyChallenges(userId) {
    try {
      // In a real implementation, this would check user's progress on challenges
      // For demo, we'll return mock challenges
      const challengesWithProgress = this.challenges.map(challenge => ({
        ...challenge,
        progress: Math.floor(Math.random() * (challenge.target + 1)), // 0 to target
        completed: Math.random() > 0.5 // 50% chance of completion
      }));

      return {
        success: true,
        challenges: challengesWithProgress
      };
    } catch (error) {
      console.error('Error getting weekly challenges:', error);
      return { success: false, error: error.message };
    }
  }

  // Get team leaderboard
  async getTeamLeaderboard(teamMembers) {
    try {
      // In a real implementation, this would calculate scores for all team members
      // For demo, we'll return mock leaderboard data
      const leaderboard = teamMembers.map((member, index) => ({
        userId: member.id,
        name: member.name,
        score: Math.floor(Math.random() * 50) + 50, // 50-100 points
        position: index + 1
      }));

      // Sort by score descending
      leaderboard.sort((a, b) => b.score - a.score);

      // Update positions
      leaderboard.forEach((user, index) => {
        user.position = index + 1;
      });

      return {
        success: true,
        leaderboard
      };
    } catch (error) {
      console.error('Error getting team leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  // Award points to user
  async awardPoints(userId, points, reason) {
    try {
      // In a real implementation, this would update user's points in the database
      console.log(`Awarding ${points} points to user ${userId} for: ${reason}`);
      
      return {
        success: true,
        message: `Awarded ${points} points for ${reason}`
      };
    } catch (error) {
      console.error('Error awarding points:', error);
      return { success: false, error: error.message };
    }
  }

  // Check and award badges
  async checkAndAwardBadges(userId) {
    try {
      // In a real implementation, this would check if user qualifies for any badges
      // and award them if they do
      
      console.log(`Checking badges for user ${userId}`);
      
      // For demo, we'll simulate awarding a random badge
      if (Math.random() > 0.7) {
        const randomBadge = this.badges[Math.floor(Math.random() * this.badges.length)];
        console.log(`Awarded badge "${randomBadge.name}" to user ${userId}`);
        
        return {
          success: true,
          badge: randomBadge
        };
      }

      return {
        success: true,
        badge: null
      };
    } catch (error) {
      console.error('Error checking and awarding badges:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new GamificationService();