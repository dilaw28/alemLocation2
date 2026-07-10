const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    duration: { type: String, default: '' },  // ex: "3 j 2 h" — durée réelle lisible
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['en_attente', 'approuvée', 'en_cours', 'terminée', 'annulée', 'refusée'],
      default: 'en_attente',
    },
    licenseImage: { type: String, default: '' },
    licenseFileId: { type: String, default: '' },
    licenseNumber: { type: String, default: '' },   // N° permis saisi lors de la réservation
    rentalType: {
      type: String,
      enum: ['personnel', 'entreprise', 'avec_chauffeur'],
      default: 'personnel',
    },
    pickupLocation: { type: String, default: '' },
    returnLocation: { type: String, default: '' },
    additionalNotes: { type: String, default: '' },
    adminNote: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    source: { type: String, enum: ['client', 'admin'], default: 'client' }, // qui a créé la réservation
    isBlock: { type: Boolean, default: false }, // true = blocage admin (maintenance), pas une vraie location client
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rental', rentalSchema);
