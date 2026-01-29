const { validationResult } = require('express-validator');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private
const castVote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { candidateId } = req.body;
    const userId = req.user._id;

    // Check if user has already voted
    if (req.user.hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'User has already voted'
      });
    }

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Check if user has already voted (double check)
    const existingVote = await Vote.findOne({ userId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'User has already voted'
      });
    }

    // Create vote
    const vote = await Vote.create({
      userId,
      candidateId
    });

    // Update candidate vote count
    await Candidate.findByIdAndUpdate(candidateId, {
      $inc: { votes: 1 }
    });

    // Update user voting status
    await User.findByIdAndUpdate(userId, {
      hasVoted: true
    });

    res.status(201).json({
      success: true,
      message: 'Vote cast successfully',
      data: {
        vote: {
          id: vote._id,
          candidateId: vote.candidateId,
          timestamp: vote.timestamp
        }
      }
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User has already voted'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's vote
// @route   GET /api/votes/my-vote
// @access  Private
const getMyVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ userId: req.user._id })
      .populate('candidateId', 'name party position');

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'No vote found'
      });
    }

    res.json({
      success: true,
      data: {
        vote: {
          id: vote._id,
          candidate: vote.candidateId,
          timestamp: vote.timestamp
        }
      }
    });
  } catch (error) {
    console.error('Get my vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all votes (Admin only)
// @route   GET /api/votes
// @access  Private/Admin
const getVotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const votes = await Vote.find()
      .populate('userId', 'name voterId')
      .populate('candidateId', 'name party position')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Vote.countDocuments();

    res.json({
      success: true,
      count: votes.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: votes
    });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get vote statistics
// @route   GET /api/votes/stats
// @access  Public
const getVoteStats = async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const totalUsers = await User.countDocuments();
    const votedUsers = await User.countDocuments({ hasVoted: true });

    // Get votes by candidate
    const candidateStats = await Vote.aggregate([
      {
        $group: {
          _id: '$candidateId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidate'
        }
      },
      {
        $unwind: '$candidate'
      },
      {
        $project: {
          candidate: {
            id: '$candidate._id',
            name: '$candidate.name',
            party: '$candidate.party',
            position: '$candidate.position'
          },
          votes: '$count'
        }
      },
      {
        $sort: { votes: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalVotes,
        totalUsers,
        votedUsers,
        turnoutPercentage: totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(2) : 0,
        candidateStats
      }
    });
  } catch (error) {
    console.error('Get vote stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  castVote,
  getMyVote,
  getVotes,
  getVoteStats
};
