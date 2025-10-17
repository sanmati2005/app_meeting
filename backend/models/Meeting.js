import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  meetingId: {
    type: String,
    required: true,
    unique: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    joinedAt: Date,
    leftAt: Date,
    role: {
      type: String,
      enum: ['host', 'participant', 'moderator'],
      default: 'participant'
    },
    status: {
      type: String,
      enum: ['invited', 'joined', 'left', 'removed'],
      default: 'invited'
    },
    isMuted: {
      type: Boolean,
      default: false
    },
    isVideoOn: {
      type: Boolean,
      default: true
    },
    isSpotlighted: {
      type: Boolean,
      default: false
    },
    handRaised: {
      type: Boolean,
      default: false
    }
  }],
  scheduledFor: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  passcode: {
    type: String,
    required: true
  },
  settings: {
    waitingRoom: {
      type: Boolean,
      default: true
    },
    muteOnEntry: {
      type: Boolean,
      default: false
    },
    enableChat: {
      type: Boolean,
      default: true
    },
    enableRecording: {
      type: Boolean,
      default: false
    },
    enableTranscription: {
      type: Boolean,
      default: true
    }
  },
  recording: {
    url: String,
    duration: Number,
    transcript: String,
    summary: String,
    aiNotes: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Meeting', meetingSchema);