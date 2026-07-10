const express = require('express');
const Location = require('../models/Location');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/locations — public, pour le client
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ type: 1, name: 1 });
    res.json({ success: true, locations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/locations/all — admin (toutes, y compris inactives)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json({ success: true, locations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/locations — admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, type, address } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Le nom est requis.' });
    const location = await Location.create({ name, type, address });
    res.status(201).json({ success: true, location });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/locations/:id — admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, location });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/locations/:id — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Localisation supprimée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
