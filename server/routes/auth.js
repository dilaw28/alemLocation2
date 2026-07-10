const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('Prénom requis'),
    body('lastName').notEmpty().withMessage('Nom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères'),
    body('phone').notEmpty().withMessage('Numéro de téléphone requis'),
    body('countryCode').notEmpty().withMessage('Indicatif pays requis'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { firstName, lastName, email, password, phone, countryCode, whatsapp } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email déjà utilisé.' });

      const user = await User.create({ firstName, lastName, email, password, phone, countryCode, whatsapp: whatsapp || '' });
      const token = generateToken(user._id);
      res.status(201).json({ success: true, token, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/update-profile
router.put('/update-profile', protect, async (req, res) => {
  const { firstName, lastName, phone, countryCode, whatsapp, address, licenseNumber, licenseImage, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, countryCode, whatsapp, address, licenseNumber, licenseImage, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
