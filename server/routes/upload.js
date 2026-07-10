const express = require('express');
const multer = require('multer');
const imagekit = require('../config/imagekit');
const Rental = require('../models/Rental');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'));
  },
});

// POST /api/upload/image
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucune image fournie.' });
    const folder = req.body.folder || 'general';
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder: `/car-rental/${folder}`,
    });
    res.json({ success: true, url: result.url, fileId: result.fileId, name: result.name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/upload/licenses/purge-all — Admin: purge ALL license images
router.delete('/licenses/purge-all', protect, adminOnly, async (req, res) => {
  try {
    const rentals = await Rental.find({ licenseFileId: { $exists: true, $ne: '' } });
    let deleted = 0, failed = 0;

    for (const rental of rentals) {
      try {
        await imagekit.deleteFile(rental.licenseFileId);
        await Rental.findByIdAndUpdate(rental._id, { licenseFileId: '', licenseImage: '[supprimé]' });
        deleted++;
      } catch (err) {
        failed++;
      }
    }

    // Also scan the ImageKit licenses folder directly
    try {
      const files = await imagekit.listFiles({ path: '/car-rental/licenses', limit: 500 });
      for (const file of files) {
        try { await imagekit.deleteFile(file.fileId); deleted++; } catch {}
      }
    } catch {}

    res.json({
      success: true,
      message: `Purge terminée : ${deleted} fichier(s) supprimé(s)${failed > 0 ? `, ${failed} échec(s)` : ''}.`,
      deleted, failed,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/upload/:fileId
router.delete('/:fileId', protect, async (req, res) => {
  try {
    await imagekit.deleteFile(req.params.fileId);
    res.json({ success: true, message: 'Image supprimée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
