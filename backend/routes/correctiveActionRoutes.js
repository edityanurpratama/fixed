const express = require('express');
const router = express.Router();
const { createAction, getActions, updateActionStatus } = require('../controllers/correctiveActionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('HSE', 'Supervisor'), createAction);
router.get('/', protect, getActions);
router.patch('/:id/status', protect, updateActionStatus);

module.exports = router;
