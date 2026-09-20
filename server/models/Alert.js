const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    default: 'Room 103'
  },
  studentName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ok', 'help', 'trapped', 'unknown'],
    required: true,
    default: 'unknown'
  },
  message: {
    type: String,
    default: ''
  },
  resolved: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
