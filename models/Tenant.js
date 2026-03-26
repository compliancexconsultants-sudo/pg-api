// models/Tenant.js
const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  pg_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pg",
    required: true
  },

  name: String,
  phone: String,
  alt_phone: String,
  email: String,
  aadhaar: String,

  permanent_address: String,

  occupation: String,
  occupation_address: String,

  id_proof: String,

  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },

  bed_number: Number,
  joining_date: Date,

  rent: Number,
  deposit: Number,

  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Tenant", TenantSchema);