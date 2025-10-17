import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    audio: {
      noiseSuppression: { type: Boolean, default: true },
      echoCancellation: { type: Boolean, default: true }
    },
    video: {
      backgroundBlur: { type: Boolean, default: false },
      virtualBackground: { type: String, default: '' }
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  microsoftId: {
    type: String,
    unique: true,
    sparse: true
  },
  calendarConnections: [{
    type: {
      type: String,
      enum: ['google', 'microsoft'],
      required: true
    },
    accessToken: String,
    refreshToken: String,
    connected: {
      type: Boolean,
      default: false
    },
    connectedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);