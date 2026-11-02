const express = require('express');
const router = express.Router();
const { bookEvent, confirmBooking, getMyBooking, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.get('/my', protect, getMyBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;