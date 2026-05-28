const express = require('express');
const router = express.Router();
const { createAudit, getAudits } = require('../controllers/auditController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('HSE', 'Manager'), createAudit);
router.get('/', protect, getAudits);

module.exports = router;
