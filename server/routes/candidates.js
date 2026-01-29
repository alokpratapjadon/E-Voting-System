const express = require('express');
const { body } = require('express-validator');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidatesByPosition
} = require('../controllers/candidateController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const candidateValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('party')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Party must be between 2 and 50 characters'),
  body('position')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be valid')
];

// Public routes
router.get('/', getCandidates);
router.get('/position/:position', getCandidatesByPosition);
router.get('/:id', getCandidate);

// Admin routes
router.post('/', protect, authorize('admin'), candidateValidation, createCandidate);
router.put('/:id', protect, authorize('admin'), candidateValidation, updateCandidate);
router.delete('/:id', protect, authorize('admin'), deleteCandidate);

module.exports = router;
