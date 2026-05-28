const express = require('express');
const router = express.Router();
const { addCertification, getMyCertifications, getAllCertifications } = require('../controllers/certificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, addCertification);
router.get('/my', protect, getMyCertifications);
router.get('/all', protect, authorize('HSE', 'Manager', 'Supervisor'), getAllCertifications);

module.exports = router;
