import recordingService from '../services/recordingService.js';
import Meeting from '../models/Meeting.js';

// Start meeting recording
const startRecording = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    // Check if user has permission to start recording
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or has permission
    const isHost = meeting.host.toString() === req.user.id;
    if (!isHost) {
      return res.status(403).json({
        success: false,
        message: 'Only host can start recording'
      });
    }

    // Start recording
    const result = await recordingService.startRecording(meetingId);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to start recording',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recording started',
      recordingId: result.recordingId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Stop meeting recording
const stopRecording = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { recordingId } = req.body;
    
    // Check if user has permission to stop recording
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check if user is host or has permission
    const isHost = meeting.host.toString() === req.user.id;
    if (!isHost) {
      return res.status(403).json({
        success: false,
        message: 'Only host can stop recording'
      });
    }

    // Stop recording
    const result = await recordingService.stopRecording(recordingId);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to stop recording',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recording stopped',
      recordingId: result.recordingId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Generate transcript from recording
const generateTranscript = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    // In a real implementation, this would retrieve the audio file
    // For demo purposes, we'll generate a mock transcript
    
    const transcriptResult = await recordingService.generateTranscript();
    
    if (!transcriptResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate transcript',
        error: transcriptResult.error
      });
    }

    // Save transcript to meeting
    await Meeting.findByIdAndUpdate(
      meetingId,
      { 'recording.transcript': transcriptResult.transcript },
      { new: true }
    );

    res.status(200).json({
      success: true,
      transcript: transcriptResult.transcript,
      speakers: transcriptResult.speakers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Generate AI meeting summary
const generateSummary = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    // Get meeting with transcript
    const meeting = await Meeting.findById(meetingId);
    if (!meeting || !meeting.recording || !meeting.recording.transcript) {
      return res.status(400).json({
        success: false,
        message: 'No transcript available for this meeting'
      });
    }

    // Generate summary
    const summaryResult = await recordingService.generateSummary(meeting.recording.transcript);
    
    if (!summaryResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate summary',
        error: summaryResult.error
      });
    }

    // Save summary to meeting
    meeting.recording.summary = summaryResult.summary;
    await meeting.save();

    res.status(200).json({
      success: true,
      summary: summaryResult.summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Generate AI action items
const generateActionItems = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    // Get meeting with transcript
    const meeting = await Meeting.findById(meetingId);
    if (!meeting || !meeting.recording || !meeting.recording.transcript) {
      return res.status(400).json({
        success: false,
        message: 'No transcript available for this meeting'
      });
    }

    // Generate action items
    const actionItemsResult = await recordingService.generateActionItems(meeting.recording.transcript);
    
    if (!actionItemsResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate action items',
        error: actionItemsResult.error
      });
    }

    // Save action items to meeting
    meeting.recording.aiNotes = JSON.stringify(actionItemsResult.actionItems);
    await meeting.save();

    res.status(200).json({
      success: true,
      actionItems: actionItemsResult.actionItems
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
  startRecording,
  stopRecording,
  generateTranscript,
  generateSummary,
  generateActionItems
};