const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  resetVotes,
  getStats
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Vote management
router.post('/reset-votes', resetVotes);

// Statistics
router.get('/stats', getStats);

module.exports = router;
