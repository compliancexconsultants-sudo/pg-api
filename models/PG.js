const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PGOwner', required: true },
  name: { type: String, required: true },
  totalRooms: { type: Number, required: true },
  roomTypes: [
    {
      shareCount: { type: Number, required: true },  // e.g., 2, 3, 4 sharing
      bedPrice: { type: Number, required: true },     // price per bed
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('PG', pgSchema);
