const express = require('express');
const { body } = require('express-validator');
const {
  getSettings,
  getSetting,
  updateSetting,
  updateSettings,
  createSetting,
  deleteSetting
} = require('../controllers/settingController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const settingValidation = [
  body('key')
    .trim()
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .withMessage('Key must be alphanumeric with underscores, starting with letter or underscore'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters')
];

// Public routes
router.get('/', getSettings);
router.get('/:key', getSetting);

// Admin routes
router.post('/', protect, authorize('admin'), settingValidation, createSetting);
router.put('/:key', protect, authorize('admin'), [
  body('value').exists().withMessage('Value is required')
], updateSetting);
router.put('/', protect, authorize('admin'), updateSettings);
router.delete('/:key', protect, authorize('admin'), deleteSetting);

module.exports = router;
