const PG = require('../models/PG');

exports.setupPG = async (req, res) => {
  try {
    const { ownerId, name, totalRooms, roomTypes } = req.body;

    const newPG = new PG({ ownerId, name, totalRooms, roomTypes });
    await newPG.save();

    res.status(201).json(newPG);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
