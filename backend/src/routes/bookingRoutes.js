const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} = require('../controllers/bookingController');

const router = express.Router();

const bookingValidators = [
  body('expertId').isMongoId().withMessage('Valid expertId is required.'),
  body('name').trim().notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('phone')
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Phone must be exactly 10 digits.'),
  body('date').trim().notEmpty().withMessage('Date is required.'),
  body('timeSlot').trim().notEmpty().withMessage('Time slot is required.'),
  body('notes').optional().isString(),
];

router.get('/', getBookingsByEmail);
router.post('/', bookingValidators, createBooking);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
