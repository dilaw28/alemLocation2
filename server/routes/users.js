const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
