const express = require('express');
const router = express.Router();
const { requestPermit, getPermits, approvePermit } = require('../controllers/workPermitController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, requestPermit);
router.get('/', protect, getPermits);
router.patch('/:id/approve', protect, authorize('HSE', 'Supervisor', 'Manager', 'Admin'), approvePermit);

module.exports = router;
