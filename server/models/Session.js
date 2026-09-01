const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Physics 101 - Photosynthesis'
  },
  room: {
    type: String,
    required: true,
    default: 'Room 103'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  transcripts: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    sender: {
      type: String,
      enum: ['TEACHER', 'STUDENT'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', SessionSchema);
