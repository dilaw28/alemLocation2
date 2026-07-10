const express = require('express');
const Car = require('../models/Car');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/cars - Get all cars with filters
router.get('/', async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice, available, search } = req.query;
    let query = {};

    if (brand) query.brand = new RegExp(brand, 'i');
    if (category) query.category = category;
    if (available !== undefined) query.isAvailable = available === 'true';
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { brand: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
      ];
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: cars.length, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cars/featured - Get featured cars for homepage
router.get('/featured', async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true }).sort({ rating: -1 }).limit(6);
    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cars - Admin: create car
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cars/:id - Admin: update car
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cars/:id - Admin: delete car
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Voiture supprimée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
