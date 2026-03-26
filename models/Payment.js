// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
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

  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  amount: Number,
  month: Number,
  year: Number,

  payment_date: Date,
  due_date: Date,

  status: {
    type: String,
    default: "paid"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);