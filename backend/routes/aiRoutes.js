const express = require('express');
const router = express.Router();
const { analyzeRisk } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/analyze', protect, analyzeRisk);

module.exports = router;
