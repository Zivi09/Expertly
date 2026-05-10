const { validationResult } = require('express-validator');
const Expert = require('../models/Expert');
const Booking = require('../models/Booking');
const { sendConfirmationEmail } = require('../services/emailService');

const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed.',
        errors: errors.array(),
      });
    }

    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    const expert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        availableSlots: {
          $elemMatch: { date, time: timeSlot, isBooked: false },
        },
      },
      { $set: { 'availableSlots.$.isBooked': true } },
      { new: true }
    );

    if (!expert) {
      return res.status(409).json({
        error: 'Slot already booked. Please choose another.',
      });
    }

    let booking;
    try {
      booking = await Booking.create({
        expertId,
        name,
        email,
        phone,
        date,
        timeSlot,
        notes: notes || '',
        status: 'confirmed',
      });
    } catch (createErr) {
      await Expert.updateOne(
        { _id: expertId },
        { $set: { 'availableSlots.$[slot].isBooked': false } },
        { arrayFilters: [{ 'slot.date': date, 'slot.time': timeSlot }] }
      );
      throw createErr;
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`expert_${expertId}`).emit('slot_booked', { date, timeSlot });
    }

    res.status(201).json(booking);

    // Send confirmation email asynchronously
    sendConfirmationEmail(booking, expert).catch(console.error);
  } catch (err) {
    next(err);
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!email || !String(email).trim()) {
      return res.status(400).json({
        error: 'Query parameter "email" is required.',
      });
    }

    const bookings = await Booking.find({
      email: String(email).trim().toLowerCase(),
    })
      .populate('expertId', 'name category')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = bookings.map((b) => ({
      _id: b._id,
      expertId: b.expertId?._id,
      expertName: b.expertId?.name,
      category: b.expertId?.category,
      name: b.name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      timeSlot: b.timeSlot,
      notes: b.notes,
      status: b.status,
      createdAt: b.createdAt,
    }));

    res.json({ bookings: formatted });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${allowed.join(', ')}.`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (status === 'confirmed') {
      const expert = await Expert.findById(booking.expertId);
      if (expert) {
        sendConfirmationEmail(booking, expert).catch(console.error);
      }
    }

    res.json(booking);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid booking id.' });
    }
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // 1. Unbook the slot in the Expert model
    await Expert.updateOne(
      { _id: booking.expertId },
      { $set: { 'availableSlots.$[slot].isBooked': false } },
      { arrayFilters: [{ 'slot.date': booking.date, 'slot.time': booking.timeSlot }] }
    );

    // 2. Delete the booking
    await Booking.findByIdAndDelete(req.params.id);

    // 3. Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('slot_unbooked', { 
        expertId: booking.expertId, 
        date: booking.date, 
        timeSlot: booking.timeSlot 
      });
    }

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid booking id.' });
    }
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
  cancelBooking,
};
