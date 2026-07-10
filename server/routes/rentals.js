const express = require('express');
const Rental = require('../models/Rental');
const Car = require('../models/Car');
const { protect, adminOnly } = require('../middleware/auth');
const Settings = require('../models/Settings');
const router = express.Router();

/**
 * Calcule le nombre de jours facturés.
 * Toute fraction de journée entamée est arrondie au jour supérieur.
 * Ex : 3 jours et 2 heures → 4 jours facturés.
 */
function computeBilledDays(start, end) {
  const diffMs = end - start;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Formate une durée en texte lisible  ex: "3 j 2 h" */
function formatDuration(start, end) {
  const diffMs = end - start;
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const mins = totalMinutes % 60;
  let parts = [];
  if (days > 0)  parts.push(`${days} j`);
  if (hours > 0) parts.push(`${hours} h`);
  if (mins > 0 && days === 0) parts.push(`${mins} min`);
  return parts.join(' ') || '< 1 min';
}

// POST /api/rentals - Create rental request
router.post('/', protect, async (req, res) => {
  try {
    const {
      carId, startDateTime, endDateTime,
      licenseImage, licenseFileId, licenseNumber,
      pickupLocation, returnLocation,
      additionalNotes, rentalType,
    } = req.body;

    if (!licenseImage) {
      return res.status(400).json({ success: false, message: 'Le permis de conduire est requis.' });
    }
    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ success: false, message: 'Les dates et heures sont requises.' });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });
    if (!car.isAvailable) return res.status(400).json({ success: false, message: 'Cette voiture est déjà réservée.' });

    const start = new Date(startDateTime);
    const end   = new Date(endDateTime);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: 'Dates invalides.' });
    }
    if (end <= start) {
      return res.status(400).json({ success: false, message: 'La date de retour doit être après la date de départ.' });
    }

    const totalDays = computeBilledDays(start, end);
    const duration  = formatDuration(start, end);

    // Load settings for surcharges + tier discounts
    const settingDocs = await Settings.find();
    const settings = { chauffeur_surcharge: 40, entreprise_surcharge: 0, price_tiers: [] };
    settingDocs.forEach(d => { settings[d.key] = d.value; });

    // Surcharge by rental type
    const surchargeRate =
      rentalType === 'avec_chauffeur' ? (settings.chauffeur_surcharge  ?? 40) / 100
      : rentalType === 'entreprise'   ? (settings.entreprise_surcharge ?? 0)  / 100
      : 0;

    // Tier discount — pick best matching threshold
    let tierDiscount = 0;
    if (Array.isArray(settings.price_tiers) && settings.price_tiers.length) {
      const sorted = [...settings.price_tiers].sort((a, b) => b.days - a.days);
      const match  = sorted.find(t => totalDays >= t.days);
      if (match) tierDiscount = (match.discount || 0) / 100;
    }

    const pricePerDay = Math.round(car.pricePerDay * (1 + surchargeRate) * (1 - tierDiscount));
    const totalPrice  = totalDays * pricePerDay;

    const rental = await Rental.create({
      user: req.user._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      duration,        // lisible ex: "3 j 2 h"
      totalPrice,
      licenseImage,
      licenseFileId: licenseFileId || '',
      licenseNumber: licenseNumber || '',
      rentalType: rentalType || 'personnel',
      pickupLocation:  pickupLocation  || '',
      returnLocation:  returnLocation  || '',
      additionalNotes: additionalNotes || '',
    });

    await rental.populate(['user', 'car']);
    res.status(201).json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rentals/my
router.get('/my', protect, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json({ success: true, rentals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rentals/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate(['user', 'car']);
    if (!rental) return res.status(404).json({ success: false, message: 'Location introuvable.' });
    if (rental.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }
    res.json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rentals/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Location introuvable.' });
    if (rental.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Accès refusé.' });
    if (!['en_attente'].includes(rental.status))
      return res.status(400).json({ success: false, message: "Impossible d'annuler cette location." });
    rental.status = 'annulée';
    await rental.save();
    res.json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin routes ──

// GET /api/rentals
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const rentals = await Rental.find(query).populate(['user', 'car']).sort({ createdAt: -1 });
    res.json({ success: true, count: rentals.length, rentals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rentals/:id/approve
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate('car');
    if (!rental) return res.status(404).json({ success: false, message: 'Location introuvable.' });
    rental.status     = 'approuvée';
    rental.approvedBy = req.user._id;
    rental.approvedAt = new Date();
    rental.adminNote  = req.body.adminNote || '';
    await rental.save();
    await Car.findByIdAndUpdate(rental.car._id, { isAvailable: false });
    await rental.populate(['user', 'car']);
    res.json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rentals/:id/reject
router.put('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      { status: 'refusée', adminNote: req.body.adminNote || '' },
      { new: true }
    ).populate(['user', 'car']);
    res.json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rentals/:id/complete
router.put('/:id/complete', protect, adminOnly, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    rental.status = 'terminée';
    await rental.save();
    await Car.findByIdAndUpdate(rental.car, { isAvailable: true });
    res.json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
