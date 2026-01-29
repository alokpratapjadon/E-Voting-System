const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
    default: null
  },
  votes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
candidateSchema.index({ position: 1, votes: -1 });

module.exports = mongoose.model('Candidate', candidateSchema);
