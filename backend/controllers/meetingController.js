import Meeting from '../models/Meeting.js';

// Create a new meeting
const createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledFor, duration, settings } = req.body;

    // Generate unique meeting ID
    const meetingId = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Generate passcode
    const passcode = crypto.randomBytes(3).toString('hex').substring(0, 6);

    // Create meeting
    const meeting = await Meeting.create({
      title,
      description,
      meetingId,
      host: req.user.id,
      scheduledFor,
      duration,
      passcode,
      settings
    });

    res.status(201).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all meetings for a user
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { host: req.user.id },
        { 'participants.user': req.user.id }
      ]
    })
    .populate('host', 'name email')
    .sort({ scheduledFor: -1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get meeting by ID
const getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'name email')
      .populate('participants.user', 'name email');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user has access to meeting
    const isHost = meeting.host._id.toString() === req.user.id;
    const isParticipant = meeting.participants.some(
      p => p.user && p.user._id.toString() === req.user.id
    );

    if (!isHost && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update meeting
const updateMeeting = async (req, res) => {
  try {
    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host
    if (meeting.host.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete meeting
const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host
    if (meeting.host.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await meeting.remove();

    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add participant to meeting
const addParticipant = async (req, res) => {
  try {
    const { userId, name, email, role } = req.body;
    const meetingId = req.params.id;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or moderator
    const isHost = meeting.host.toString() === req.user.id;
    const isModerator = meeting.participants.some(
      p => p.user && p.user.toString() === req.user.id && p.role === 'moderator'
    );

    if (!isHost && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if participant already exists
    const existingParticipant = meeting.participants.find(
      p => (p.user && p.user.toString() === userId) || p.email === email
    );

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Participant already added to meeting'
      });
    }

    // Add participant with join time
    meeting.participants.push({
      user: userId,
      name,
      email,
      role: role || 'participant',
      status: 'invited',
      joinedAt: new Date()
    });

    await meeting.save();

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update participant join time
const updateParticipantJoinTime = async (req, res) => {
  try {
    const { meetingId, participantId } = req.params;
    const { joinedAt, role } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Find participant and update join time
    const participant = meeting.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    participant.joinedAt = joinedAt;
    
    // Update role if provided
    if (role) {
      participant.role = role;
    }
    
    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'Participant join time updated successfully',
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update participant leave time
const updateParticipantLeaveTime = async (req, res) => {
  try {
    const { meetingId, participantId } = req.params;
    const { leftAt } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Find participant and update leave time
    const participant = meeting.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    participant.leftAt = leftAt;
    
    // Calculate duration if both join and leave times are available
    if (participant.joinedAt && leftAt) {
      const durationMs = new Date(leftAt) - new Date(participant.joinedAt);
      participant.duration = Math.floor(durationMs / 1000); // Duration in seconds
    }
    
    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'Participant leave time updated successfully',
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get participant analytics
const getParticipantAnalytics = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    const meeting = await Meeting.findById(meetingId)
      .populate('participants.user', 'name email');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Calculate participant durations and engagement metrics
    const participantData = meeting.participants.map(participant => {
      let duration = 0;
      
      // Calculate duration based on join/leave times
      if (participant.joinedAt) {
        if (participant.leftAt) {
          // Participant has left
          const durationMs = new Date(participant.leftAt) - new Date(participant.joinedAt);
          duration = Math.floor(durationMs / 1000); // Duration in seconds
        } else {
          // Participant is still in meeting, calculate current duration
          const durationMs = new Date() - new Date(participant.joinedAt);
          duration = Math.floor(durationMs / 1000); // Duration in seconds
        }
      }
      
      return {
        userId: participant.user ? participant.user._id : null,
        name: participant.name || (participant.user ? participant.user.name : 'Unknown'),
        email: participant.email || (participant.user ? participant.user.email : ''),
        joinedAt: participant.joinedAt,
        leftAt: participant.leftAt,
        duration, // in seconds
        isMuted: participant.isMuted || false,
        isVideoOn: participant.isVideoOn !== undefined ? participant.isVideoOn : true,
        role: participant.role || 'participant'
      };
    });

    res.status(200).json({
      success: true,
      participantData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Enhanced analytics for user engagement tracking
const getUserEngagementStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all meetings where this user participated
    const meetings = await Meeting.find({
      'participants.user': userId
    }).populate('host', 'name email');
    
    // Calculate engagement statistics
    let totalMeetings = 0;
    let totalTime = 0; // in seconds
    let weeklyPattern = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };
    
    const meetingHours = {}; // Track usage by hour
    
    for (const meeting of meetings) {
      totalMeetings++;
      
      // Find this user's participation data
      const participant = meeting.participants.find(p => 
        p.user && p.user._id.toString() === userId
      );
      
      if (participant && participant.joinedAt) {
        let duration = 0;
        
        if (participant.leftAt) {
          // Calculate completed meeting duration
          const durationMs = new Date(participant.leftAt) - new Date(participant.joinedAt);
          duration = Math.floor(durationMs / 1000);
        } else if (meeting.status === 'completed') {
          // If meeting is completed but no leave time recorded, use scheduled duration
          duration = meeting.duration * 60; // Convert minutes to seconds
        } else {
          // For ongoing meetings, skip for now or estimate
          continue;
        }
        
        totalTime += duration;
        
        // Track weekly pattern
        const joinDate = new Date(participant.joinedAt);
        const dayOfWeek = joinDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (weeklyPattern[dayOfWeek] !== undefined) {
          weeklyPattern[dayOfWeek] += 1;
        }
        
        // Track hourly pattern
        const hour = joinDate.getHours();
        meetingHours[hour] = (meetingHours[hour] || 0) + 1;
      }
    }
    
    // Calculate average meeting time
    const avgMeetingTime = totalMeetings > 0 ? Math.floor(totalTime / totalMeetings) : 0;
    
    // Find peak hours (most active hours)
    const peakHours = Object.entries(meetingHours)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    res.status(200).json({
      success: true,
      stats: {
        totalMeetings,
        totalTime, // in seconds
        avgMeetingTime, // in seconds
        weeklyPattern,
        peakHours,
        formatted: {
          totalMeetings,
          totalTime: formatDuration(totalTime),
          avgMeetingTime: formatDuration(avgMeetingTime)
        }
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

// Helper function to format duration
const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Mute/unmute participant
const muteParticipant = async (req, res) => {
  try {
    const { meetingId, participantId } = req.params;
    const { muted } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or moderator
    const isHost = meeting.host.toString() === req.user.id;
    const isModerator = meeting.participants.some(
      p => p.user && p.user.toString() === req.user.id && p.role === 'moderator'
    );

    if (!isHost && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find participant and update mute status
    const participant = meeting.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    participant.isMuted = muted;
    await meeting.save();

    res.status(200).json({
      success: true,
      message: `Participant ${muted ? 'muted' : 'unmuted'} successfully`,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Remove participant from meeting
const removeParticipant = async (req, res) => {
  try {
    const { meetingId, participantId } = req.params;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or moderator
    const isHost = meeting.host.toString() === req.user.id;
    const isModerator = meeting.participants.some(
      p => p.user && p.user.toString() === req.user.id && p.role === 'moderator'
    );

    if (!isHost && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only hosts and moderators can remove participants.'
      });
    }

    // Find participant and remove them
    const participantIndex = meeting.participants.findIndex(
      p => p._id.toString() === participantId
    );

    if (participantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Don't allow removing the host
    if (meeting.participants[participantIndex].user && 
        meeting.participants[participantIndex].user.toString() === meeting.host.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot remove the host'
      });
    }

    // Get participant info before removing for the response
    const removedParticipant = meeting.participants[participantIndex];
    const participantName = removedParticipant.name || 
      (removedParticipant.user ? removedParticipant.user.name : 'Unknown');

    meeting.participants.splice(participantIndex, 1);
    await meeting.save();

    // Emit WebSocket event to notify all participants that someone was removed
    // This would typically be done through the WebSocket server instance
    // For now, we'll just return success

    res.status(200).json({
      success: true,
      message: `Participant ${participantName} removed successfully`,
      meeting
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing participant',
      error: error.message
    });
  }
};

// Spotlight participant
const spotlightParticipant = async (req, res) => {
  try {
    const { meetingId, participantId } = req.params;
    const { spotlighted } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or moderator
    const isHost = meeting.host.toString() === req.user.id;
    const isModerator = meeting.participants.some(
      p => p.user && p.user.toString() === req.user.id && p.role === 'moderator'
    );

    if (!isHost && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove spotlight from all participants first
    meeting.participants.forEach(participant => {
      participant.isSpotlighted = false;
    });

    // Spotlight the specified participant
    const participant = meeting.participants.id(participantId);
    if (participant) {
      participant.isSpotlighted = spotlighted;
    }

    await meeting.save();

    res.status(200).json({
      success: true,
      message: `Participant ${spotlighted ? 'spotlighted' : 'removed from spotlight'} successfully`,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Toggle hand raise
const toggleHandRaise = async (req, res) => {
  try {
    const { meetingId, participantId } = req.params;
    const { handRaised } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or moderator or the participant themselves
    const isHost = meeting.host.toString() === req.user.id;
    const isModerator = meeting.participants.some(
      p => p.user && p.user.toString() === req.user.id && p.role === 'moderator'
    );
    const isParticipant = meeting.participants.id(participantId) && 
      meeting.participants.id(participantId).user && 
      meeting.participants.id(participantId).user.toString() === req.user.id;

    if (!isHost && !isModerator && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find participant and update hand raise status
    const participant = meeting.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    participant.handRaised = handRaised;
    await meeting.save();

    res.status(200).json({
      success: true,
      message: `Hand ${handRaised ? 'raised' : 'lowered'} successfully`,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update meeting status
const updateMeetingStatus = async (req, res) => {
  try {
    const { status, recording } = req.body;
    const meetingId = req.params.id;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host
    if (meeting.host.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update status
    meeting.status = status;

    // Update recording if provided
    if (recording) {
      meeting.recording = recording;
    }

    await meeting.save();

    res.status(200).json({
      success: true,
      meeting
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
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  addParticipant,
  updateParticipantJoinTime,
  updateParticipantLeaveTime,
  getParticipantAnalytics,
  getUserEngagementStats,
  muteParticipant,
  removeParticipant,
  spotlightParticipant,
  toggleHandRaise,
  updateMeetingStatus
};