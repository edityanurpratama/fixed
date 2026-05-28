const express = require('express');
const router = express.Router();
const { getDashboardStats, getMonthlyAnalytics, getReportData } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getDashboardStats);
router.get('/monthly', protect, getMonthlyAnalytics);
router.get('/report-data', protect, getReportData);
module.exports = router;

