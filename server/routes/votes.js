const express = require('express');
const { body } = require('express-validator');
const {
  castVote,
  getMyVote,
  getVotes,
  getVoteStats
} = require('../controllers/voteController');

const { protect, authorize, checkVotingEligibility } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const voteValidation = [
  body('candidateId')
    .isMongoId()
    .withMessage('Please provide a valid candidate ID')
];

// Public routes
router.get('/stats', getVoteStats);

// Protected routes
router.post('/', protect, checkVotingEligibility, voteValidation, castVote);
router.get('/my-vote', protect, getMyVote);

// Admin routes
router.get('/', protect, authorize('admin'), getVotes);

module.exports = router;
