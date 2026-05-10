const Expert = require('../models/Expert');

const getExperts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(String(req.query.limit), 10) || 10)
    );
    const category = req.query.category;
    const search = req.query.search;

    const filter = {};
    if (category && String(category).trim() && category !== 'All') {
      filter.category = String(category).trim();
    }
    if (search && String(search).trim()) {
      const q = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: q }, { bio: q }, { category: q }];
    }

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        'name category experience rating bio avatar createdAt updatedAt'
      )
      .lean();

    res.json({
      experts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (err) {
    next(err);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found.' });
    }
    res.json(expert);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid expert id.' });
    }
    next(err);
  }
};

module.exports = { getExperts, getExpertById };
