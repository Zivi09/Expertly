const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    rating: { type: Number, required: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: null },
    price: { type: Number, default: 50 },
    skills: { type: [String], default: [] },
    sessionsCount: { type: Number, default: 0 },
    availableSlots: [slotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expert', expertSchema);
