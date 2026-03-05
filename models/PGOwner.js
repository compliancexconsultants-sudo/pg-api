const mongoose = require('mongoose');

const pgOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  gstNumber: { type: String, required: true, unique: true },
   password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PGOwner', pgOwnerSchema);
