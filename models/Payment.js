const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    roomNumber: String,
    bedNumber: String,

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "RENT",
        "ADVANCE",
        "FINE",
        "REFUND",
        "MAINTENANCE",
        "OTHER",
      ],
      default: "RENT",
    },

    month: {
      type: Number, // 1-12
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    note: String,

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
