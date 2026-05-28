const express = require('express');
const router = express.Router();
const { createHazard, getHazards, updateStatus } = require('../controllers/hazardController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', protect, upload.single('foto'), createHazard);
router.get('/', protect, getHazards);
router.patch('/:id/status', protect, authorize('HSE', 'Supervisor'), updateStatus);

module.exports = router;
