const express = require('express');
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

const DEFAULTS = {
  chauffeur_surcharge:  40,
  entreprise_surcharge: 0,
  price_tiers: [],   // tableau libre de paliers définis par l'admin
};

// GET /api/settings — public
router.get('/', async (req, res) => {
  try {
    const docs = await Settings.find();
    const settings = { ...DEFAULTS };
    docs.forEach(d => { settings[d.key] = d.value; });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings/:key — admin only
router.put('/:key', protect, adminOnly, async (req, res) => {
  try {
    const { value } = req.body;
    const doc = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true, new: true }
    );
    res.json({ success: true, setting: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
