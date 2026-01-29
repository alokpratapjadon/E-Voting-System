const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one vote per user
voteSchema.index({ userId: 1 }, { unique: true });

// Index for performance
voteSchema.index({ candidateId: 1, timestamp: -1 });

module.exports = mongoose.model('Vote', voteSchema);
