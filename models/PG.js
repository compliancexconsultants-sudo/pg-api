const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PGOwner"
  },
  name: String,
  totalRooms: Number,
  address: String,
  qrCode: {
  type: String,
}
});

module.exports = mongoose.model("PG", pgSchema);