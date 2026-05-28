const express = require('express');
const router = express.Router();
const { createIncident, getIncidents } = require('../controllers/incidentController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', protect, upload.single('foto'), createIncident);
router.get('/', protect, getIncidents);

module.exports = router;
