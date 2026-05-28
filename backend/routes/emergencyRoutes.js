const express = require('express');
const router = express.Router();
const { triggerEmergency, getEmergencies } = require('../controllers/emergencyController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('Admin', 'HSE', 'Supervisor', 'Manager'), triggerEmergency);
router.get('/', protect, authorize('Admin', 'HSE', 'Supervisor', 'Manager'), getEmergencies);

module.exports = router;
