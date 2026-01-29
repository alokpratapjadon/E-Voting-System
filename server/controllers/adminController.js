const User = require('../models/User');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has voted
    if (user.hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user who has already voted'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset all votes (emergency reset)
// @route   POST /api/admin/reset-votes
// @access  Private/Admin
const resetVotes = async (req, res) => {
  try {
    // Reset all user voting status
    await User.updateMany({}, { hasVoted: false });

    // Reset all candidate vote counts
    await Candidate.updateMany({}, { votes: 0 });

    // Delete all votes
    await Vote.deleteMany({});

    res.json({
      success: true,
      message: 'All votes have been reset successfully'
    });
  } catch (error) {
    console.error('Reset votes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalVoters = await User.countDocuments({ isAdmin: false });
    const votedUsers = await User.countDocuments({ hasVoted: true });
    const totalCandidates = await Candidate.countDocuments();
    const totalVotes = await Vote.countDocuments();

    // Get recent votes
    const recentVotes = await Vote.find()
      .populate('userId', 'name voterId')
      .populate('candidateId', 'name party')
      .sort({ timestamp: -1 })
      .limit(10);

    // Get vote distribution by candidate
    const voteDistribution = await Vote.aggregate([
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
          candidate: '$candidate.name',
          party: '$candidate.party',
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
        users: {
          total: totalUsers,
          admins: totalAdmins,
          voters: totalVoters,
          voted: votedUsers,
          turnoutPercentage: totalVoters > 0 ? ((votedUsers / totalVoters) * 100).toFixed(2) : 0
        },
        candidates: {
          total: totalCandidates
        },
        votes: {
          total: totalVotes,
          distribution: voteDistribution
        },
        recentVotes
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  resetVotes,
  getStats
};
