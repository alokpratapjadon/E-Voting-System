const { validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1, votes: -1 });

    res.json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Public
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create candidate
// @route   POST /api/candidates
// @access  Private/Admin
const createCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const candidate = await Candidate.create(req.body);

    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this information already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private/Admin
const updateCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Check if candidate has votes
    const voteCount = await Vote.countDocuments({ candidateId: req.params.id });
    if (voteCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete candidate with existing votes'
      });
    }

    await Candidate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get candidates by position
// @route   GET /api/candidates/position/:position
// @access  Public
const getCandidatesByPosition = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      position: req.params.position
    }).sort({ votes: -1 });

    res.json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    console.error('Get candidates by position error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidatesByPosition
};
