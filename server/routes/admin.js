const express = require('express');
const User = require('../models/User');
const Car = require('../models/Car');
const Rental = require('../models/Rental');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/dashboard - Stats
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalCars, totalRentals, pendingRentals] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Car.countDocuments(),
      Rental.countDocuments(),
      Rental.countDocuments({ status: 'en_attente' }),
    ]);

    const revenue = await Rental.aggregate([
      { $match: { status: { $in: ['approuvée', 'en_cours', 'terminée'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCars,
        totalRentals,
        pendingRentals,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users - All users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users/:id - User details
router.get('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });

    const rentals = await Rental.find({ user: user._id }).populate('car').sort({ createdAt: -1 });
    res.json({ success: true, user, rentals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id/toggle-active
router.put('/users/:id/toggle-active', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
