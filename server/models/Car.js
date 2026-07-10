const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Économique', 'Berline', 'SUV', 'Luxe', 'Utilitaire', 'Électrique'],
      required: true,
    },
    transmission: { type: String, enum: ['Manuelle', 'Automatique'], default: 'Automatique' },
    fuel: { type: String, enum: ['Essence', 'Diesel', 'Électrique', 'Hybride'], default: 'Essence' },
    seats: { type: Number, default: 5 },
    pricePerDay: { type: Number, required: true },
    description: { type: String, default: '' },
    features: [String],
    images: [String], // ImageKit URLs
    isAvailable: { type: Boolean, default: true },
    unavailableReason: { type: String, default: '' }, // ex: "Maintenance", "Accident"
    location: { type: String, default: 'Paris' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRentals: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
