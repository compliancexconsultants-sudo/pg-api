const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PGOwner",
      required: true,
      index: true,
    },
    name: String,
    referenceContact: String,
    contactnumber: String,
    aadharNumber: String,

    roomNumber: String,
    bedNumber: String,

    userPhoto: String,
    aadharCardPhoto: String,

    permanentAddress: String,
    occupation: String,
    occupationAddress: String,

    // 💰 FINANCIAL DETAILS
    monthlyRent: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
      required: true,
    },
    rentDueDay: {
      type: Number,
      default: 5, // every month 5th
    },

    rentStatus: {
      type: String,
      enum: ["PAID", "PENDING", "OVERDUE"],
      default: "PENDING",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "NOTICE_PERIOD", "VACATED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
