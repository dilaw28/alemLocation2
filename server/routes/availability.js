const express = require('express');
const Car = require('../models/Car');
const Rental = require('../models/Rental');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

/**
 * Chevauchement de deux périodes [s1,e1] et [s2,e2]
 */
function overlaps(s1, e1, s2, e2) {
  return new Date(s1) < new Date(e2) && new Date(s2) < new Date(e1);
}

/* ───────────────────────────────────────────────────────────
   GET /api/availability/overview
   Vue d'ensemble : toutes les voitures avec leur statut actuel
   (disponible / louée actuellement / bloquée) + locataire en cours
   ─────────────────────────────────────────────────────────── */
router.get('/overview', protect, adminOnly, async (req, res) => {
  try {
    const cars = await Car.find().sort({ brand: 1, model: 1 });
    const now = new Date();

    // Toutes les réservations actives (en cours actuellement) tous statuts confondus
    const activeRentals = await Rental.find({
      startDate: { $lte: now },
      endDate:   { $gte: now },
      status: { $in: ['approuvée', 'en_cours'] },
    }).populate('user', 'firstName lastName email phone countryCode whatsapp');

    const activeByCarId = {};
    activeRentals.forEach(r => { activeByCarId[r.car.toString()] = r; });

    const overview = cars.map(car => {
      const current = activeByCarId[car._id.toString()];
      let status = 'disponible';
      if (!car.isAvailable && !current) status = 'bloquée';
      else if (current) status = 'louée';

      return {
        _id: car._id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        images: car.images,
        pricePerDay: car.pricePerDay,
        isAvailable: car.isAvailable,
        unavailableReason: car.unavailableReason,
        status, // 'disponible' | 'louée' | 'bloquée'
        currentRental: current ? {
          _id: current._id,
          startDate: current.startDate,
          endDate: current.endDate,
          rentalType: current.rentalType,
          status: current.status,
          renter: current.user ? {
            name: `${current.user.firstName} ${current.user.lastName}`,
            email: current.user.email,
            phone: current.user.phone ? `${current.user.countryCode || ''} ${current.user.phone}` : '',
            whatsapp: current.user.whatsapp || '',
          } : null,
        } : null,
      };
    });

    res.json({ success: true, cars: overview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ───────────────────────────────────────────────────────────
   GET /api/availability/:carId/calendar
   Toutes les périodes réservées/bloquées pour UNE voiture
   (pour affichage calendrier)
   ─────────────────────────────────────────────────────────── */
router.get('/:carId/calendar', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });

    const rentals = await Rental.find({
      car: req.params.carId,
      status: { $in: ['en_attente', 'approuvée', 'en_cours'] },
    })
      .populate('user', 'firstName lastName email phone countryCode')
      .sort({ startDate: 1 });

    const periods = rentals.map(r => ({
      _id: r._id,
      startDate: r.startDate,
      endDate: r.endDate,
      status: r.status,
      isBlock: r.isBlock,
      rentalType: r.rentalType,
      adminNote: r.adminNote,
      additionalNotes: r.additionalNotes,
      totalPrice: r.totalPrice,
      source: r.source,
      renter: r.user ? {
        id: r.user._id,
        name: `${r.user.firstName} ${r.user.lastName}`,
        email: r.user.email,
        phone: r.user.phone ? `${r.user.countryCode || ''} ${r.user.phone}` : '',
      } : null,
    }));

    res.json({ success: true, car, periods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ───────────────────────────────────────────────────────────
   POST /api/availability/:carId/block
   Bloquer une voiture pour une période donnée (maintenance, etc.)
   ─────────────────────────────────────────────────────────── */
router.post('/:carId/block', protect, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Dates de début et de fin requises.' });
    }
    const start = new Date(startDate);
    const end   = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ success: false, message: 'La date de fin doit être après la date de début.' });
    }

    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });

    // Vérifier les conflits avec des réservations existantes
    const conflicts = await Rental.find({
      car: req.params.carId,
      status: { $in: ['en_attente', 'approuvée', 'en_cours'] },
    });
    const hasConflict = conflicts.some(r => overlaps(start, end, r.startDate, r.endDate));
    if (hasConflict) {
      return res.status(400).json({ success: false, message: 'Cette période chevauche une réservation existante.' });
    }

    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    const block = await Rental.create({
      car: req.params.carId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice: 0,
      status: 'approuvée',
      isBlock: true,
      source: 'admin',
      adminNote: reason || 'Indisponibilité',
      additionalNotes: reason || '',
    });

    res.status(201).json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ───────────────────────────────────────────────────────────
   POST /api/availability/:carId/book
   Réservation manuelle créée par l'admin pour un client,
   sur des dates précises (sans passer par le flux public)
   ─────────────────────────────────────────────────────────── */
router.post('/:carId/book', protect, adminOnly, async (req, res) => {
  try {
    const { userId, startDate, endDate, rentalType, pickupLocation, returnLocation, additionalNotes } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Dates requises.' });
    }
    const start = new Date(startDate);
    const end   = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ success: false, message: 'La date de fin doit être après la date de début.' });
    }

    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });

    // Vérifier les conflits
    const conflicts = await Rental.find({
      car: req.params.carId,
      status: { $in: ['en_attente', 'approuvée', 'en_cours'] },
    });
    const hasConflict = conflicts.some(r => overlaps(start, end, r.startDate, r.endDate));
    if (hasConflict) {
      return res.status(400).json({ success: false, message: 'Cette période chevauche une réservation existante.' });
    }

    const totalDays  = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = totalDays * car.pricePerDay;

    const rental = await Rental.create({
      user: userId || undefined,
      car: req.params.carId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      status: 'approuvée',
      rentalType: rentalType || 'personnel',
      pickupLocation: pickupLocation || '',
      returnLocation: returnLocation || '',
      additionalNotes: additionalNotes || '',
      source: 'admin',
      approvedBy: req.user._id,
      approvedAt: new Date(),
    });

    await rental.populate(['user', 'car']);
    res.status(201).json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ───────────────────────────────────────────────────────────
   PUT /api/availability/:carId/toggle
   Bascule rapide disponible / indisponible (sans dates précises)
   ─────────────────────────────────────────────────────────── */
router.put('/:carId/toggle', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });

    car.isAvailable = !car.isAvailable;
    car.unavailableReason = car.isAvailable ? '' : (req.body.reason || 'Indisponible');
    await car.save();

    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ───────────────────────────────────────────────────────────
   DELETE /api/availability/period/:rentalId
   Supprimer un blocage ou une réservation manuelle
   ─────────────────────────────────────────────────────────── */
router.delete('/period/:rentalId', protect, adminOnly, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.rentalId);
    if (!rental) return res.status(404).json({ success: false, message: 'Période introuvable.' });

    await Rental.findByIdAndDelete(req.params.rentalId);

    // Si c'était la location en cours, remettre la voiture disponible
    const car = await Car.findById(rental.car);
    if (car && !car.isAvailable && !car.unavailableReason) {
      car.isAvailable = true;
      await car.save();
    }

    res.json({ success: true, message: 'Période supprimée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
