const express = require('express');
const router = express.Router();
const fatigueController = require('../controllers/fatigueController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/log', protect, fatigueController.logFatigue);
router.get('/history', protect, fatigueController.getFatigueHistory);

module.exports = router;
